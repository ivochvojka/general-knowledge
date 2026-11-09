import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import './build.mjs';
import { renderIndex } from './templates.mjs';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const filenames = (await readdir(new URL('content/lessons/', root))).filter(name => name.endsWith('.json'));
const lessons = await Promise.all(filenames.map(async name => JSON.parse(await read(`content/lessons/${name}`))));
const index = await read('dist/index.html');
const pages = new Map([['index.html', index], ['404.html', await read('dist/404.html')]]);
for (const lesson of lessons) pages.set(`lekce/${lesson.id}/index.html`, await read(`dist/lekce/${lesson.id}/index.html`));
const decode = text => text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

test('all generated navigation and assets resolve under the Pages project prefix', async () => {
  for (const [path, html] of pages) {
    const pageUrl = `https://example.test/general-knowledge/${path.replace(/index\.html$/, '')}`;
    for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const url = new URL(decode(raw), pageUrl);
      if (url.origin !== 'https://example.test') continue;
      assert.ok(url.pathname.startsWith('/general-knowledge/'), `${path}: outside project prefix: ${url.pathname}`);
      let target = url.pathname.slice('/general-knowledge/'.length);
      if (!target || target.endsWith('/')) target += 'index.html';
      const contents = await read(`dist/${target}`);
      if (url.hash) assert.ok(contents.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${path}: missing anchor ${url.href}`);
    }
  }
});

test('every published lesson has accessible quiz answers and retains its publication date', () => {
  for (const lesson of lessons) {
    const html = pages.get(`lekce/${lesson.id}/index.html`);
    assert.ok(lesson.quiz.length >= 5);
    assert.equal([...html.matchAll(/<details>/g)].length, lesson.quiz.length);
    assert.equal([...html.matchAll(/<summary>/g)].length, lesson.quiz.length);
    for (const item of lesson.quiz) assert.ok(html.includes(item.answer.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')));
    assert.ok(html.includes(`<time datetime="${lesson.date}">`));
  }
});

test('catalogue indexes facts, book summaries and subsections as readable text', () => {
  assert.ok(index.includes('Kleisthenových'));
  assert.ok(index.includes('Winston Smith'));
  assert.ok(index.includes('212,0 milionu'));
  assert.ok(!index.includes('[object Object]'));
  assert.equal([...index.matchAll(/data-lesson="/g)].length, lessons.length);
  assert.equal([...index.matchAll(/<h4>/g)].length, lessons.length - 1);
  assert.ok(!/<\d+>/.test(index));
  assert.ok(index.includes('id="pripravujeme"'));
});

test('new publications replace the featured lesson and return the previous one to its category', () => {
  const make = (id, date, publicationOrder = 1) => ({
    ...lessons[0], id, date, publicationOrder, title: id, category: 'Hudba',
    cover: { src: 'https://example.com/image.jpg' },
  });
  const older = make('older', '2026-11-08');
  const current = make('current', '2026-11-09');
  const next = make('next', '2026-11-09', 2);
  const featuredId = html => html.match(/id="nejnovejsi"[\s\S]*?data-lesson="([^"]+)"/)?.[1];
  const before = renderIndex([current, older]);
  assert.equal(featuredId(before), 'current');
  const after = renderIndex([next, older, current]);
  assert.equal(featuredId(after), 'next');
  assert.equal([...after.matchAll(/data-lesson="current"/g)].length, 1);
  assert.match(after.slice(after.indexOf('id="prehled"')), /data-topic="Hudba"[\s\S]*data-lesson="current"/);
  assert.equal([...after.matchAll(/data-lesson="/g)].length, 3);
  assert.equal(featuredId(renderIndex([{ ...next, date: undefined, publicationOrder: undefined }, older])), 'older');
  assert.equal(featuredId(renderIndex([older, { ...current, date: '2026-11-10' } ])), 'current');
  assert.ok(!renderIndex([current]).includes('<section class="topic" data-topic="Hudba">'));
});

test('external links keep their labels and open safely in another tab', () => {
  for (const [path, html] of pages) {
    for (const [, attributes] of html.matchAll(/<a\s+([^>]+)>/g)) {
      if (!attributes.includes('href="https://')) continue;
      assert.ok(attributes.includes('target="_blank"'), path);
      assert.ok(attributes.includes('rel="noopener"'), path);
      assert.ok(attributes.includes('aria-label="'), path);
    }
    for (const [, alt] of html.matchAll(/<figure>\s*<img[^>]+alt="([^"]*)"/g)) assert.ok(alt.length > 5, path);
  }
});

test('image fallback handles cached failures and later load errors', async () => {
  const script = await read('assets/media.js');
  for (const cached of [true, false]) {
    const fallback = { hidden: true };
    let onError;
    const image = {
      complete: cached, naturalWidth: 0, hidden: false,
      addEventListener(event, handler) { assert.equal(event, 'error'); onError = handler; },
      closest() { return { querySelector() { return fallback; } }; },
    };
    runInNewContext(script, { document: { querySelectorAll() { return [image]; } } });
    if (!cached) { assert.equal(image.hidden, false); onError(); }
    assert.equal(image.hidden, true);
    assert.equal(fallback.hidden, false);
  }
});
