import { createHash } from 'node:crypto';
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { renderIndex, renderLesson, renderNotFound } from './templates.mjs';

const root = new URL('../', import.meta.url);
const content = new URL('content/lessons/', root);
const dist = new URL('dist/', root);
const lessons = [];
const titles = new Set();

function requiredText(value, field) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Chybí text: ${field}`);
}

function requiredList(value, field) {
  if (!Array.isArray(value) || !value.length) throw new Error(`Chybí položky: ${field}`);
}

function httpsUrl(value, field) {
  requiredText(value, field);
  if (new URL(value).protocol !== 'https:') throw new Error(`${field} musí používat HTTPS.`);
}

function prepareImage(image, field) {
  for (const key of ['file', 'alt', 'credit', 'license']) requiredText(image?.[key], `${field}.${key}`);
  if (!/^[^/#?%]+\.(jpe?g|png|webp|svg)$/i.test(image.file) || image.file.includes(' ')) {
    throw new Error(`${field}.file musí být název souboru z Wikimedia Commons s podtržítky místo mezer.`);
  }
  if (image.licenseUrl !== undefined) httpsUrl(image.licenseUrl, `${field}.licenseUrl`);
  const file = image.file.normalize('NFC');
  const hash = createHash('md5').update(file).digest('hex');
  const name = encodeURIComponent(file);
  const path = `${hash[0]}/${hash.slice(0, 2)}/${name}`;
  image.source = `https://commons.wikimedia.org/wiki/File:${name}`;
  image.src = `https://upload.wikimedia.org/wikipedia/commons/${path}`;
  if (image.thumbnailWidth !== undefined) {
    if (![330, 500, 960, 1280].includes(image.thumbnailWidth)) {
      throw new Error(`${field}.thumbnailWidth musí být 330, 500, 960 nebo 1280.`);
    }
    const suffix = /\.svg$/i.test(file) ? '.png' : '';
    image.src = `https://thumb.wikimedia.org/wikipedia/commons/thumb/${path}/${image.thumbnailWidth}px-${name}${suffix}`;
  }
}

function validDate(value, field) {
  const parsed = new Date(value);
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)
      || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error(`${field} musí být platné datum ve formátu RRRR-MM-DD.`);
  }
}

function validate(lesson, filename) {
  const { id, title, category, intro, date, scheduledFor, publicationOrder, cover, sections, quiz, sources } = lesson;
  if (typeof id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || filename !== `${id}.json`) {
    throw new Error('ID musí odpovídat názvu souboru a obsahovat jen malá ASCII písmena, číslice a pomlčky.');
  }
  for (const [field, value] of Object.entries({ title, category, intro })) requiredText(value, field);
  const titleKey = title.trim().normalize('NFC').toLocaleLowerCase('cs');
  if (titles.has(titleKey)) throw new Error(`Duplicitní název: ${title}`);

  if (date !== undefined) validDate(date, 'date');
  if (scheduledFor !== undefined) validDate(scheduledFor, 'scheduledFor');
  if (publicationOrder !== undefined && (!date || !Number.isSafeInteger(publicationOrder) || publicationOrder < 1)) {
    throw new Error('publicationOrder vyžaduje datum a musí být kladné celé číslo.');
  }
  if (sources !== undefined) {
    requiredList(sources, 'sources');
    for (const source of sources) {
      requiredText(source.title, 'sources.title');
      httpsUrl(source.url, 'sources.url');
    }
  }
  prepareImage(cover, 'cover');
  requiredList(sections, 'sections');
  for (const section of sections) {
    requiredText(section.title, 'sections.title');
    requiredText(section.text, 'sections.text');
    if (section.image !== undefined) prepareImage(section.image, 'sections.image');
    if (section.extra !== undefined) requiredText(section.extra, 'sections.extra');
    if (section.facts !== undefined) {
      requiredList(section.facts, 'sections.facts');
      for (const fact of section.facts) {
        requiredText(fact.label, 'sections.facts.label');
        requiredText(fact.value, 'sections.facts.value');
      }
    }
    if (section.subsections !== undefined) {
      requiredList(section.subsections, 'sections.subsections');
      for (const part of section.subsections) {
        requiredText(part.title, 'sections.subsections.title');
        requiredText(part.text, 'sections.subsections.text');
      }
    }
    for (const field of ['links', 'works']) {
      if (section[field] === undefined) continue;
      requiredList(section[field], `sections.${field}`);
      for (const item of section[field]) {
        requiredText(item.title, `sections.${field}.title`);
        httpsUrl(item.url, `sections.${field}.url`);
        if (field === 'works') requiredText(item.summary, 'sections.works.summary');
      }
    }
    if (section.musicHeading !== undefined) requiredText(section.musicHeading, 'sections.musicHeading');
    for (const field of ['music', 'furtherMusic']) {
      if (section[field] === undefined) continue;
      requiredList(section[field], `sections.${field}`);
      for (const work of section[field]) {
        if (typeof work === 'string') requiredText(work, `sections.${field}[]`);
        else {
          requiredText(work.title, `sections.${field}.title`);
          requiredText(work.description, `sections.${field}.description`);
          httpsUrl(work.url, `sections.${field}.url`);
          httpsUrl(work.verificationUrl, `sections.${field}.verificationUrl`);
          if (!/^\d{4}-\d{2}-\d{2}$/.test(work.verifiedOn ?? '')) throw new Error('Chybí datum ověření poslechu.');
        }
      }
    }
  }
  requiredList(quiz, 'quiz');
  if (quiz.length < 5) throw new Error('Lekce musí mít alespoň 5 kvízových otázek.');
  for (const item of quiz) {
    requiredText(item.question, 'quiz.question');
    requiredText(item.answer, 'quiz.answer');
  }
  titles.add(titleKey);
}

for (const filename of (await readdir(content)).filter(name => name.endsWith('.json')).sort()) {
  try {
    const lesson = JSON.parse(await readFile(new URL(filename, content), 'utf8'));
    validate(lesson, filename);
    lessons.push(lesson);
  } catch (error) {
    throw new Error(`${filename}: ${error.message}`, { cause: error });
  }
}
requiredList(lessons, 'content/lessons');
const plan = JSON.parse(await readFile(new URL('content/plan.json', root), 'utf8'));
if (!Array.isArray(plan)) throw new Error('content/plan.json musí být seznam.');
const ids = new Set(lessons.map(lesson => lesson.id));
for (const item of plan) {
  for (const key of ['id', 'title', 'category', 'summary']) requiredText(item[key], `plan.${key}`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id) || ids.has(item.id)) throw new Error(`Neplatné nebo duplicitní plánované ID: ${item.id}`);
  ids.add(item.id);
}
lessons.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '') || a.title.localeCompare(b.title, 'cs'));
await rm(dist, { recursive: true, force: true });
await mkdir(new URL('lekce/', dist), { recursive: true });
await cp(new URL('assets/', root), new URL('assets/', dist), { recursive: true });
await writeFile(new URL('.nojekyll', dist), '');
await writeFile(new URL('index.html', dist), renderIndex(lessons, plan));
await writeFile(new URL('404.html', dist), renderNotFound());
for (const lesson of lessons) {
  const directory = new URL(`lekce/${lesson.id}/`, dist);
  await mkdir(directory);
  await writeFile(new URL('index.html', directory), renderLesson(lesson));
}
console.log(`Vygenerováno ${lessons.length} lekcí v dist/.`);
