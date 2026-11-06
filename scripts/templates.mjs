const site = 'Všeobecný rozhled';
const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escape = value => value.replace(/[&<>"']/g, character => entities[character]);

function page({ title, description, base, body, script }) {
  return `<!doctype html>
<html lang="cs">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f6f3eb">
  <meta name="description" content="${escape(description)}">
  <title>${escape(title)}</title>
  <link rel="stylesheet" href="${base}assets/site.css">
  ${script ? `<script src="${base}assets/${script}" defer></script>` : ''}
</head>
<body>
  <a class="skip" href="#obsah">Přeskočit na obsah</a>
  <header class="masthead">
    <div class="wrap masthead-inner">
      <a class="brand" href="${base}"><span class="monogram" aria-hidden="true">VR</span> ${site}</a>
      <a class="nav-link" href="${base}#prehled">Přehled lekcí</a>
    </div>
  </header>
  ${body}
  <footer class="footer wrap">
    <span>${site} · Osobní encyklopedie</span>
    <a href="https://github.com/ivochvojka/general-knowledge">Zdrojový kód a lekce na GitHubu</a>
  </footer>
</body>
</html>`;
}

function illustration({ src, alt, credit, source, license, licenseUrl }) {
  return `<figure>
    <img src="${escape(src)}" alt="${escape(alt)}" decoding="async">
    <figcaption>${escape(alt)}. ${escape(credit)} · <a href="${escape(source)}">Wikimedia Commons</a> ·
      ${licenseUrl ? `<a href="${escape(licenseUrl)}">${escape(license)}</a>` : escape(license)}
    </figcaption>
  </figure>`;
}

function readingTime({ intro, sections }) {
  const words = [intro, ...sections.flatMap(({ title, text, extra }) => [title, text, extra])]
    .filter(Boolean).join(' ').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function card(lesson) {
  const keywords = [lesson.category, ...lesson.sections.flatMap(section =>
    [section.title, section.text, section.extra, ...(section.music ?? [])].filter(Boolean))];
  return `<li class="lesson-card" data-lesson="${lesson.id}" data-search="${escape(keywords.join(' '))}">
    <a href="./lekce/${lesson.id}/">
      <span class="card-meta">${escape(lesson.category)} · ${readingTime(lesson)} min</span>
      <h4>${escape(lesson.title)}</h4>
      <p>${escape(lesson.intro)}</p>
      <span class="card-arrow" aria-hidden="true">↗</span>
    </a>
  </li>`;
}

export function renderIndex(lessons) {
  const groups = new Map();
  for (const lesson of lessons) {
    const topic = ['České dějiny', 'Moderní dějiny'].includes(lesson.category) ? 'Historie' : lesson.category;
    if (!groups.has(topic)) groups.set(topic, []);
    groups.get(topic).push(lesson);
  }
  const topics = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b, 'cs'));
  const featured = lessons.find(lesson => lesson.id === 'jizni-amerika') ?? lessons[0];
  const description = 'Česká osobní encyklopedie s krátkými lekcemi o historii, geografii, hudbě a literatuře.';

  return page({ title: site, description, base: './', script: 'catalog.js', body: `
  <main id="obsah">
    <section class="hero wrap">
      <div>
        <p class="eyebrow">Osobní encyklopedie</p>
        <h1>Všeobecný<br>rozhled<span class="accent">.</span></h1>
        <p class="lede">Krátké lekce o dějinách, místech a lidech, kteří utvářeli svět. Na konci každé lekce si můžete vyzkoušet, co jste si zapamatovali.</p>
        <a class="button" href="#prehled">Procházet lekce <span aria-hidden="true">↓</span></a>
      </div>
      <aside class="featured" aria-label="Z obrazového archivu">
        ${illustration(featured.cover)}
        <a class="featured-link" href="./lekce/${featured.id}/">Z obrazového archivu <strong>${escape(featured.title)} ↗</strong></a>
      </aside>
    </section>
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
      </div>
      <p class="results" id="results" role="status">${lessons.length} lekcí v knihovně</p>
      ${topics.map(([topic, items]) => `<section class="topic" data-topic="${escape(topic)}">
        <h3 class="topic-name">${escape(topic)}</h3>
        <ul class="lesson-grid">${items.map(card).join('')}</ul>
      </section>`).join('')}
    </section>
  </main>` });
}

function musicLinks({ title, music }) {
  if (!music) return '';
  const composer = title.replace(/\s*\([^)]*\)\s*$/, '');
  return `<div class="music"><p>Poslech na YouTube Music</p><ul>${music.map(work =>
    `<li><a href="https://music.youtube.com/search?q=${encodeURIComponent(`${composer} ${work}`)}">${escape(work)}</a></li>`
  ).join('')}</ul></div>`;
}

export function renderLesson(lesson) {
  const { title, category, intro, cover, sections, quiz } = lesson;
  return page({ title: `${title} | ${site}`, description: intro, base: '../../', body: `
  <main id="obsah" class="reading wrap">
    <a class="back" href="../../#prehled">← Všechny lekce</a>
    <article>
      <header class="article-header">
        <p class="eyebrow">${escape(category)} · ${readingTime(lesson)} min čtení</p>
        <h1>${escape(title)}</h1>
        <p class="lede">${escape(intro)}</p>
      </header>
      ${illustration(cover)}
      ${sections.map(section => `<section class="chapter">
        <h2>${escape(section.title)}</h2>
        ${section.text.split(/\n\s*\n/).map(paragraph => `<p>${escape(paragraph)}</p>`).join('')}
        ${section.extra ? `<p class="aside-note"><strong>Zapamatujte si</strong> ${escape(section.extra)}</p>` : ''}
        ${musicLinks(section)}
      </section>`).join('')}
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
