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

function validate(lesson, filename) {
  const { id, title, category, intro, cover, sections, quiz } = lesson;
  if (typeof id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || filename !== `${id}.json`) {
    throw new Error('ID musí odpovídat názvu souboru a obsahovat jen malá ASCII písmena, číslice a pomlčky.');
  }
  for (const [field, value] of Object.entries({ title, category, intro })) requiredText(value, field);
  const titleKey = title.trim().normalize('NFC').toLocaleLowerCase('cs');
  if (titles.has(titleKey)) throw new Error(`Duplicitní název: ${title}`);

  for (const field of ['file', 'alt', 'credit', 'license']) requiredText(cover?.[field], `cover.${field}`);
  if (!/^[^/#?%]+\.(jpe?g|png|webp|svg)$/i.test(cover.file) || cover.file.includes(' ')) {
    throw new Error('cover.file musí být název souboru z Wikimedia Commons s podtržítky místo mezer.');
  }
  if (cover.licenseUrl !== undefined && new URL(cover.licenseUrl).protocol !== 'https:') {
    throw new Error('cover.licenseUrl musí používat HTTPS.');
  }
  requiredList(sections, 'sections');
  for (const section of sections) {
    requiredText(section.title, 'sections.title');
    requiredText(section.text, 'sections.text');
    if (section.extra !== undefined) requiredText(section.extra, 'sections.extra');
    if (section.music !== undefined) {
      requiredList(section.music, 'sections.music');
      for (const work of section.music) requiredText(work, 'sections.music[]');
    }
  }
  requiredList(quiz, 'quiz');
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
    const file = lesson.cover.file.normalize('NFC');
    const hash = createHash('md5').update(file).digest('hex');
    lesson.cover.src = `https://upload.wikimedia.org/wikipedia/commons/${hash[0]}/${hash.slice(0, 2)}/${encodeURIComponent(file)}`;
    lesson.cover.source = `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`;
    lessons.push(lesson);
  } catch (error) {
    throw new Error(`${filename}: ${error.message}`, { cause: error });
  }
}
requiredList(lessons, 'content/lessons');
lessons.sort((a, b) => a.title.localeCompare(b.title, 'cs'));
await rm(dist, { recursive: true, force: true });
await mkdir(new URL('lekce/', dist), { recursive: true });
await cp(new URL('assets/', root), new URL('assets/', dist), { recursive: true });
await writeFile(new URL('.nojekyll', dist), '');
await writeFile(new URL('index.html', dist), renderIndex(lessons));
await writeFile(new URL('404.html', dist), renderNotFound());
for (const lesson of lessons) {
  const directory = new URL(`lekce/${lesson.id}/`, dist);
  await mkdir(directory);
  await writeFile(new URL('index.html', directory), renderLesson(lesson));
}
console.log(`Vygenerováno ${lessons.length} lekcí v dist/.`);
