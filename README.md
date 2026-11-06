# Všeobecný rozhled – webová encyklopedie

Statický web pro GitHub Pages. Nevyžaduje server, databázi ani build krok.

## Publikování
1. Na GitHubu vytvořte **nový veřejný repozitář** (např. `vseobecny-rozhled`).
2. Nahrajte soubory `index.html`, `lessons.js` do kořene repozitáře.
3. V **Settings → Pages** zvolte **Deploy from a branch**, `main`, složka `/ (root)`.
4. Web se zobrazí na `https://UZIVATEL.github.io/vseobecny-rozhled/`.

## Aktualizace lekcí
Obsah je v souboru `lessons.js`. Po commitu do `main` GitHub Pages automaticky publikuje změny. Připojení GitHubu v ChatGPT lze využít pro úpravy souborů v repozitáři.

## Obrázky
Stránka hledá a zobrazuje skutečné fotografie a portréty přes veřejné API Wikimedia Commons až při otevření lekce. Jde o automatický výběr, který může být nepřesný; každé zobrazení obsahuje odkaz na původní soubor a licenční údaje. Obrázky se načítají z internetu a pro offline režim nejsou součástí webu.

## Poznámka k obsahu
Jde o první redakčně zkrácenou verzi sedmi témat, nikoliv doslovný přepis původních dlouhých lekcí. Obsah lze postupně doplnit.
