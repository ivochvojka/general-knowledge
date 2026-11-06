# Všeobecný rozhled

Veřejná česká osobní encyklopedie. Původních sedm zkrácených lekcí je v adresáři `content/lessons/`. Každá má vlastní adresu ve tvaru `/general-knowledge/lekce/<id>/`. Odkazy z původního katalogu ve tvaru `/#<id>` se přesměrují na odpovídající lekci.

## Architektura a místní spuštění

- `content/lessons/` obsahuje jeden soubor JSON na lekci. Git eviduje historii textů, obrázků i otázek.
- `scripts/build.mjs` v Node.js 24 ověří strukturu dat a vygeneruje katalog, stránky lekcí a stránku 404 do `dist/`. Generátor nepotřebuje instalovat balíčky ani přistupovat k síti.
- `assets/` obsahuje sdílené styly a vyhledávání. Katalog, lekce a rozbalovací odpovědi fungují i bez JavaScriptu. Obrázky se načítají přímo z Wikimedia Commons.

```sh
node scripts/build.mjs
python3 -m http.server 8000 --directory dist
```

Místní katalog se otevře na [localhost:8000](http://localhost:8000/). Výstup `dist/` se znovu generuje při každém sestavení.

## Přidání lekce

1. Přidejte soubor `content/lessons/<id>.json` podle některé stávající lekce. Stabilní `id` musí odpovídat názvu souboru a používat malá ASCII písmena, číslice a pomlčky.
2. Vyplňte `title`, `category`, datum lekce `date` ve formátu `RRRR-MM-DD` podle pražského času, `intro`, oddíly `sections` a otázky `quiz`. Oddíl má `title` a `text`, volitelně `extra`, obrázek `image` nebo seznam skladeb `music`. Prázdný řádek v textu odděluje odstavce. Položka kvízu má `question` a `answer`. Zdroje pro text patří do pole `sources`, každá položka má `title` a HTTPS odkaz `url`.
3. Do `cover` a případného `sections[].image` zapište přesný název souboru z Wikimedia Commons bez předpony `File:`, s podtržítky místo mezer. Přidejte český alternativní popis `alt`, autora `credit`, licenci `license` a u licencovaných obrázků také odkaz `licenseUrl`. Pokud stránka souboru nabízí náhled v šířce 330, 500, 960 nebo 1280 px, lze ji nastavit v `thumbnailWidth`. Ověřte dostupnost náhledu i údaje na stránce konkrétního souboru.
4. Spusťte `node scripts/build.mjs` a zkontrolujte vygenerovanou stránku. Nový soubor se při sestavení automaticky objeví v katalogu a ve vyhledávání.

## GitHub Pages

V [Settings → Pages](https://github.com/ivochvojka/general-knowledge/settings/pages) vyberte jako zdroj **GitHub Actions**. Workflow `.github/workflows/pages.yml` ověřuje sestavení u pull requestů do `main` a po změně na `main` nasadí nový výstup. Po prvním úspěšném nasazení je očekávaná adresa [ivochvojka.github.io/general-knowledge](https://ivochvojka.github.io/general-knowledge/). Workflow lze také spustit ručně z karty Actions.

U lekcí z prvního vydání uvádíme datum prvního doloženého zveřejnění na GitHub Pages. Přesnější pořadí lekcí ze stejného vydání z dat zveřejnění nevyplývá.

## Pravidelné lekce

Místní úloha Codex **Všeobecný rozhled – nová lekce** je naplánována na pondělí a čtvrtek v 8:00 pražského času. Po úspěšných kontrolách odesílá nové lekce přímo do `main`.

1. Projít inventář `content/lessons/`, historii Gitu i rozpracované návrhy a vyloučit významové překryvy. Pokud už pro daný termín lekce existuje, ohlásit její stav.
2. Střídat historii, geografii, vědu, kulturu, literaturu a významné osobnosti. Pro čtyři minuty čtení mířit přibližně na 600–750 českých slov. Zařadit důležitá data, souvislosti, zajímavosti a 3–5 otázek s odpověďmi.
3. Ověřit fakta, zdroje a licence, přidat jeden nový JSON, spustit kontroly a připravit místní commit. Ověřit zdroj GitHub Pages a odeslat nový commit přímo do `origin/main`. Po nasazení ověřit veřejnou stránku lekce.
