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
2. Vyplňte `title`, `category`, `intro`, oddíly `sections` a otázky `quiz`. Oddíl má `title` a `text`, volitelně `extra` a seznam názvů skladeb `music`. Prázdný řádek v textu odděluje odstavce. Položka kvízu má `question` a `answer`.
3. Do `cover` zapište přesný název souboru z Wikimedia Commons bez předpony `File:`, s podtržítky místo mezer. Přidejte český alternativní popis `alt`, autora `credit`, licenci `license` a u licencovaných obrázků také odkaz `licenseUrl`. Údaje ověřte přímo na stránce konkrétního souboru.
4. Spusťte `node scripts/build.mjs` a zkontrolujte vygenerovanou stránku. Nový soubor se při sestavení automaticky objeví v katalogu a ve vyhledávání.

## GitHub Pages

V [Settings → Pages](https://github.com/ivochvojka/general-knowledge/settings/pages) vyberte jako zdroj **GitHub Actions**. Workflow `.github/workflows/pages.yml` ověřuje sestavení u pull requestů do `main` a po změně na `main` nasadí nový výstup. Po prvním úspěšném nasazení je očekávaná adresa [ivochvojka.github.io/general-knowledge](https://ivochvojka.github.io/general-knowledge/). Workflow lze také spustit ručně z karty Actions.

## Pravidelné lekce

Smlouva pro budoucí plánovanou úlohu:

1. Spouštět v pondělí a ve čtvrtek v časovém pásmu `Europe/Prague`.
2. Z aktuální větve `main` načíst názvy a osnovy všech lekcí i otevřených návrhů. Při výběru tématu kontrolovat i významové překryvy. Sestavení kontroluje shodu ID s názvem souboru a duplicity názvů.
3. Střídat historii, geografii, vědu, kulturu, literaturu a významné osobnosti. Pro čtyři minuty čtení mířit přibližně na 700–800 českých slov. Zařadit důležitá data, souvislosti, zajímavost a krátký kvíz s odpověďmi.
4. Ověřit fakta a licenci obrázku, přidat jeden nový JSON, spustit sestavení a otevřít pull request k redakční kontrole. Pro stejný publikační den používat stejnou větev, aby opakované spuštění aktualizovalo existující návrh. Po sloučení lekci zveřejní workflow GitHub Pages.

Pravidelný generátor ani jeho plán zatím nejsou připojené. Dosavadní kratší lekce lze rozšiřovat přímo v jejich datových souborech.
