const controls = document.querySelector('#catalog-controls');
const search = document.querySelector('#search');
const topicSelect = document.querySelector('#topic');
const sortSelect = document.querySelector('#sort');
const chronology = document.querySelector('#chronology');
const chronologicalList = chronology.querySelector('ul');
const results = document.querySelector('#results');
const groups = [...document.querySelectorAll('[data-topic]')];

const normalize = text => text.toLocaleLowerCase('cs').normalize('NFD').replace(/\p{M}/gu, '');
const entries = groups.map(group => ({
  group,
  list: group.querySelector('ul'),
  lessons: [...group.querySelectorAll('[data-lesson]')].map(card => ({
    card,
    date: card.querySelector('time')?.dateTime ?? '',
    order: Number(card.dataset.order),
    title: card.querySelector('h4').textContent,
    text: normalize([group.dataset.topic, card.textContent, card.dataset.search].join(' ')),
  })),
}));
const allLessons = entries.flatMap(({ lessons }) => lessons);
let currentSort = 'topic';

function arrange() {
  if (currentSort === sortSelect.value) return;
  currentSort = sortSelect.value;
  if (currentSort === 'topic') {
    for (const { list, lessons } of entries) list.append(...lessons.map(({ card }) => card));
    return;
  }
  const direction = currentSort === 'oldest' ? 1 : -1;
  const ordered = [...allLessons].sort((a, b) =>
    Number(Boolean(b.date)) - Number(Boolean(a.date))
    || direction * a.date.localeCompare(b.date)
    || direction * (a.order - b.order)
    || a.title.localeCompare(b.title, 'cs'));
  chronologicalList.append(...ordered.map(({ card }) => card));
}

function filter() {
  arrange();
  const tokens = normalize(search.value).split(/\s+/).filter(Boolean);
  let count = 0;
  for (const { group, lessons } of entries) {
    let matches = 0;
    const inTopic = !topicSelect.value || group.dataset.topic === topicSelect.value;
    for (const { card, text } of lessons) {
      const visible = inTopic && tokens.every(token => text.includes(token));
      card.hidden = !visible;
      if (visible) matches++;
    }
    group.hidden = currentSort !== 'topic' || matches === 0;
    count += matches;
  }
  chronology.hidden = currentSort === 'topic' || count === 0;
  const noun = count === 1 ? 'lekce' : count >= 2 && count <= 4 ? 'lekce' : 'lekcí';
  results.textContent = count ? `${count} ${noun}` : 'Žádná odpovídající lekce.';
}

search.addEventListener('input', filter);
topicSelect.addEventListener('change', filter);
sortSelect.addEventListener('change', filter);
controls.hidden = false;
window.addEventListener('pageshow', filter);

// Preserve links from the original hash-based catalogue.
const oldId = location.hash.slice(1);
const legacyLink = [...document.querySelectorAll('[data-lesson]')]
  .find(card => card.dataset.lesson === oldId)?.querySelector('a');
if (legacyLink) location.replace(legacyLink.href);
