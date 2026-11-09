const site = 'Všeobecný rozhled';
const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escape = value => value.replace(/[&<>"']/g, character => entities[character]);

function externalLink(url, label) {
  return `<a href="${escape(url)}" target="_blank" rel="noopener" aria-label="${escape(label)} (otevře se na nové kartě)">${escape(label)}</a>`;
}

function page({ title, description, base, body, script }) {
  return `<!doctype html>
<html lang="cs">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#102b22">
  <meta name="description" content="${escape(description)}">
  <title>${escape(title)}</title>
  <link rel="stylesheet" href="${base}assets/site.css">
  <script src="${base}assets/media.js" defer></script>
  ${script ? `<script src="${base}assets/${script}" defer></script>` : ''}
</head>
<body>
  <a class="skip" href="#obsah">Přeskočit na obsah</a>
  <header class="masthead">
    <div class="wrap masthead-inner">
      <a class="brand" href="${base}"><span class="monogram" aria-hidden="true">✧</span> ${site}</a>
      <a class="nav-link" href="${base}#prehled">Přehled lekcí</a>
    </div>
  </header>
  ${body}
  <footer class="footer wrap">
    <span>${site} · Osobní encyklopedie</span>
    ${externalLink('https://github.com/ivochvojka/general-knowledge', 'Zdrojový kód a lekce na GitHubu')}
  </footer>
</body>
</html>`;
}

function illustration({ src, alt, credit, source, license, licenseUrl }) {
  return `<figure>
    <img src="${escape(src)}" alt="${escape(alt)}" loading="lazy" decoding="async">
    <p class="image-fallback" hidden>Obrázek se nepodařilo načíst: ${escape(alt)}. Originál najdete pod odkazem v popisku.</p>
    <figcaption>${escape(alt)}. ${escape(credit)} · ${externalLink(source, 'Wikimedia Commons')} ·
      ${licenseUrl ? externalLink(licenseUrl, license) : escape(license)}
    </figcaption>
  </figure>`;
}

function sectionText(section) {
  return [section.title, section.text, section.extra,
    ...(section.facts ?? []).flatMap(({ label, value }) => [label, value]),
    ...(section.subsections ?? []).flatMap(({ title, text }) => [title, text]),
    ...(section.works ?? []).flatMap(({ title, summary }) => [title, summary]),
    ...(section.music ?? []).flatMap(work => typeof work === 'string' ? [work] : [work.title, work.description])
  ].filter(Boolean);
}

function readingTime({ intro, sections }) {
  const words = [intro, ...sections.flatMap(sectionText)]
    .filter(Boolean).join(' ').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

const publicationDateFormat = new Intl.DateTimeFormat('cs', {
  dateStyle: 'long', timeZone: 'Europe/Prague',
});

function publicationDate(date) {
  if (!date) return '';
  return `<time datetime="${date}">${publicationDateFormat.format(new Date(date))}</time>`;
}

function card(lesson, heading = 'h4') {
  const keywords = [lesson.category, ...lesson.sections.flatMap(sectionText)];
  return `<li class="lesson-card" data-lesson="${lesson.id}" data-order="${lesson.publicationOrder ?? ''}" data-search="${escape(keywords.join(' '))}">
    <a href="./lekce/${lesson.id}/">
      <div class="card-cover" aria-hidden="true">
        <img src="${escape(lesson.cover.src)}" alt="" loading="lazy" decoding="async">
      </div>
      <div class="card-body">
        <span class="card-meta">${escape(lesson.category)} · ${readingTime(lesson)} min${lesson.date ? ` · ${publicationDate(lesson.date)}` : ''}</span>
        <${heading}>${escape(lesson.title)}</${heading}>
        <p>${escape(lesson.intro)}</p>
        <span class="card-arrow" aria-hidden="true">→</span>
      </div>
    </a>
  </li>`;
}

export function renderIndex(lessons, plan = []) {
  const latest = [...lessons].sort((a, b) =>
    (b.date ?? '').localeCompare(a.date ?? '')
    || (b.publicationOrder ?? 0) - (a.publicationOrder ?? 0)
    || a.title.localeCompare(b.title, 'cs'))[0];
  const topicFor = lesson => ['České dějiny', 'Moderní dějiny'].includes(lesson.category) ? 'Historie' : lesson.category;
  const groups = new Map();
  for (const lesson of lessons) {
    const topic = topicFor(lesson);
    if (!groups.has(topic)) groups.set(topic, []);
    groups.get(topic).push(lesson);
  }
  const topics = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b, 'cs'));
  const description = 'Česká osobní encyklopedie s krátkými lekcemi o historii, geografii, hudbě a literatuře.';

  return page({ title: site, description, base: './', script: 'catalog.js', body: `
  <main id="obsah">
    <section class="hero" aria-labelledby="home-title">
      <div class="hero-inner wrap">
        <p class="eyebrow">Encyklopedie pro zvídavé</p>
        <h1 id="home-title">${site}</h1>
        <p class="lede">Krátké lekce o dějinách, místech a lidech, kteří utvářeli svět. Na konci každé lekce si můžete vyzkoušet, co jste si zapamatovali.</p>
        <a class="button" href="#prehled">Procházet lekce <span aria-hidden="true">↓</span></a>
      </div>
    </section>
    ${latest ? `<section id="nejnovejsi" class="latest wrap" data-topic="${escape(topicFor(latest))}" aria-labelledby="latest-title">
      <p class="eyebrow">Právě v knihovně</p>
      <h2 id="latest-title">Nejnovější lekce</h2>
      <ul class="lesson-grid">${card(latest, 'h3')}</ul>
    </section>` : ''}
    <section id="prehled" class="catalog wrap">
      <p class="eyebrow">Knihovna</p>
      <h2>Přehled lekcí</h2>
      <div id="catalog-controls" class="catalog-controls" hidden>
        <label for="search">Hledat v lekcích
          <input id="search" type="search" placeholder="Např. Mozart nebo Karlův most">
        </label>
        <label for="topic">Téma
          <select id="topic">
            <option value="">Všechna témata</option>
            ${topics.map(([topic]) => `<option>${escape(topic)}</option>`).join('')}
          </select>
        </label>
        <label for="sort">Řazení
          <select id="sort">
            <option value="topic">Podle tématu</option>
            <option value="newest">Od nejnovějších</option>
            <option value="oldest">Od nejstarších</option>
          </select>
        </label>
      </div>
      <p class="results" id="results" role="status">${lessons.length} lekcí v knihovně</p>
      <section class="topic" id="chronology" hidden>
        <h3 class="topic-name">Podle data publikace</h3>
        <ul class="lesson-grid"></ul>
      </section>
      ${topics.map(([topic, items]) => [topic, items.filter(lesson => lesson !== latest)]).filter(([, items]) => items.length).map(([topic, items]) => `<section class="topic" data-topic="${escape(topic)}">
        <h3 class="topic-name">${escape(topic)}</h3>
        <ul class="lesson-grid">${items.map(lesson => card(lesson)).join('')}</ul>
      </section>`).join('')}
    </section>
    ${plan.length ? `<section id="pripravujeme" class="planned wrap" aria-labelledby="plan-title">
      <p class="eyebrow">Kam dál</p>
      <h2 id="plan-title">Plánované lekce</h2>
      <p>Pokračování a samostatná česká témata zařadíme mezi další lekce při střídání oborů. Termíny zatím nejsou stanovené.</p>
      <ul>${plan.map(({ title, category, summary }) => `<li><h3>${escape(title)}</h3><p class="card-meta">${escape(category)}</p><p>${escape(summary)}</p></li>`).join('')}</ul>
    </section>` : ''}
  </main>` });
}

function musicLinks({ title, music }) {
  if (!music) return '';
  const composer = title.replace(/\s*\([^)]*\)\s*$/, '');
  const recordings = music.filter(work => typeof work !== 'string');
  const searches = music.filter(work => typeof work === 'string');
  return `<div class="music">
    ${recordings.length ? `<h3>Doporučený poslech na YouTube Music</h3><ul class="work-list">${recordings.map(work =>
      `<li>${externalLink(work.url, work.title)}<p>${escape(work.description)}</p><small>${externalLink(work.verificationUrl, 'Otevřít také na YouTube')}</small></li>`
    ).join('')}</ul>` : ''}
    ${searches.length ? `<p>Další díla — vyhledat na YouTube Music</p><ul>${searches.map(work =>
      `<li>${externalLink(`https://music.youtube.com/search?q=${encodeURIComponent(`${composer} ${work}`)}`, work)}</li>`
    ).join('')}</ul>` : ''}
  </div>`;
}

const paragraphs = text => text.split(/\n\s*\n/).map(paragraph => `<p>${escape(paragraph)}</p>`).join('');

export function renderLesson(lesson) {
  const { title, category, intro, date, cover, sections, quiz, sources } = lesson;
  return page({ title: `${title} | ${site}`, description: intro, base: '../../', body: `
  <main id="obsah" class="reading wrap">
    <a class="back" href="../../#prehled">← Všechny lekce</a>
    <article>
      <header class="article-header">
        <p class="eyebrow">${escape(category)} · ${readingTime(lesson)} min čtení${date ? ` · Publikováno ${publicationDate(date)}` : ''}</p>
        <h1>${escape(title)}</h1>
        <p class="lede">${escape(intro)}</p>
      </header>
      ${sections.some(section => section.image?.file === cover.file) ? '' : illustration(cover)}
      ${sections.map(section => `<section class="chapter">
        <h2>${escape(section.title)}</h2>
        ${section.facts ? `<dl class="facts">${section.facts.map(({ label, value }) => `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl>` : ''}
        ${paragraphs(section.text)}
        ${(section.subsections ?? []).map(({ title, text }) => `<div class="subchapter"><h3>${escape(title)}</h3>${paragraphs(text)}</div>`).join('')}
        ${section.works ? `<h3 class="works-title">Díla v kostce</h3><ul class="work-list">${section.works.map(({ title, summary, url }) => `<li>${externalLink(url, title)}<p>${escape(summary)}</p></li>`).join('')}</ul>` : ''}
        ${section.image ? illustration(section.image) : ''}
        ${section.extra ? `<p class="aside-note"><strong>Zapamatujte si</strong> ${escape(section.extra)}</p>` : ''}
        ${musicLinks(section)}
        ${section.links ? `<ul class="section-links">${section.links.map(({ title, url }) => `<li>${externalLink(url, title)}</li>`).join('')}</ul>` : ''}
      </section>`).join('')}
      ${sources ? `<section class="chapter">
        <h2>Zdroje</h2>
        <ul>${sources.map(({ title, url }) => `<li>${externalLink(url, title)}</li>`).join('')}</ul>
      </section>` : ''}
      <section class="quiz">
        <p class="eyebrow">Co si pamatujete?</p>
        <h2>Krátký kvíz</h2>
        ${quiz.map(({ question, answer }) => `<details>
          <summary>${escape(question)}</summary>
          <p>${escape(answer)}</p>
        </details>`).join('')}
      </section>
    </article>
  </main>` });
}

export function renderNotFound() {
  // A project site's 404 is also served at arbitrary nested URLs.
  const base = '/general-knowledge/';
  return page({ title: `Stránka nenalezena | ${site}`, description: 'Stránka nenalezena.', base, body: `
  <main id="obsah" class="reading wrap">
    <h1>Stránka nenalezena</h1>
    <a class="button" href="${base}#prehled">Přejít na přehled lekcí</a>
  </main>` });
}
