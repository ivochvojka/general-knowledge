const controls = document.querySelector('#catalog-controls');
const search = document.querySelector('#search');
const topicSelect = document.querySelector('#topic');
const results = document.querySelector('#results');
const groups = [...document.querySelectorAll('[data-topic]')];

const normalize = text => text.toLocaleLowerCase('cs').normalize('NFD').replace(/\p{M}/gu, '');
const entries = groups.map(group => ({
  group,
  lessons: [...group.querySelectorAll('[data-lesson]')].map(card => ({
    card,
    text: normalize([group.dataset.topic, card.textContent, card.dataset.search].join(' ')),
  })),
}));

function filter() {
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
    group.hidden = matches === 0;
    count += matches;
  }
  const noun = count === 1 ? 'lekce' : count >= 2 && count <= 4 ? 'lekce' : 'lekcí';
  results.textContent = count ? `${count} ${noun}` : 'Žádná odpovídající lekce.';
}

search.addEventListener('input', filter);
topicSelect.addEventListener('change', filter);
controls.hidden = false;
window.addEventListener('pageshow', filter);

// Preserve links from the original hash-based catalogue.
const oldId = location.hash.slice(1);
const legacyLink = [...document.querySelectorAll('[data-lesson]')]
  .find(card => card.dataset.lesson === oldId)?.querySelector('a');
if (legacyLink) location.replace(legacyLink.href);
