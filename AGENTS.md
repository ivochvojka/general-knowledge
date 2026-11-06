# AGENTS.md — General Knowledge / Všeobecný rozhled

## Mission and ownership
You are maintaining the public, Czech-language general-knowledge encyclopedia **Všeobecný rozhled**.

- GitHub repository: `ivochvojka/general-knowledge`
- Local checkout on the owner's Mac: `/Users/ivochvojka/general-knowledge`
- Target publication: `https://ivochvojka.github.io/general-knowledge/` via GitHub Pages.
- Audience: curious Czech-speaking adults; accessible to non-specialists, intellectually rigorous, engaging.
- The owner wants **one continuously growing website**, not Excel, Google Sheets, PDF, or a new site per lesson.
- Default conversation and editorial language: **Czech**. Technical comments and code may be English.

**Important:** These are project instructions, not evidence that deployment or scheduling is already active. Inspect the repository and GitHub Pages settings before claiming that either works.

## Start every coding session
1. Inspect the repository (`git status`, file tree, README, package/build configuration, existing lesson schema, GitHub Actions, and tests). Do not overwrite uncommitted user work.
2. Determine the current implementation and preserve working behavior. The original prototype was a static `index.html` + `lessons.js` website, without a backend or build step; this may have changed.
3. Read existing lessons and their IDs/slugs before adding anything; avoid duplicates.
4. For a substantial change, state a short plan, implement, run appropriate checks, and summarize changed files and remaining limitations.
5. Never claim that a push, Pages deployment, scheduled run, image download, or source verification succeeded unless verified.

## Editorial requirements
Each **new lesson** must:
- Be written in natural, clear Czech with correct diacritics, around **four minutes of reading** (roughly 550–750 Czech words; favor completeness over a rigid word count).
- Have a specific title, unique stable slug/ID, subject category, publication date (Europe/Prague), engaging introduction, clear subsections, and a memorable conclusion.
- Explain important **dates, people, places, causes and consequences**, historical context, and at least two illuminating or surprising facts.
- Distinguish established facts from uncertain or disputed interpretations; do not invent dates, quotes, statistics, bibliographic facts, or references. Verify material factual claims against reliable sources when network/research tools are available. If verification is not possible, say so and avoid unverified specifics.
- End with a short **quiz** (ideally 3–5 questions) and clearly accessible correct answers/explanations; use the site's interactive quiz UI if available.
- Use real, relevant **historical portraits, photographs, maps or reproductions**, not generated placeholder art or generic icon templates. If a genuine image cannot be obtained, show a tasteful text fallback rather than a misleading image.
- For musical works, add useful **YouTube Music** links where a real, relevant URL has been verified; never fabricate links.
- Include source references for claims and media attribution where appropriate. Preserve original work titles, accents and names.
- Never silently shorten an existing lesson when migrating or editing it. Preserve all substantive material, adding corrections with care.

### Topic rotation
Rotate among world literature and authors; countries and regions (South America, Asia, Africa, Europe); Czech and world history; ancient civilizations; culture and music; science; geography; political history; and significant people. Avoid two closely overlapping topics in succession. Read existing lessons to prevent repetition. Be neutral, factual, and well-sourced on contested political or historical matters.

### Existing seed subjects — preserve and expand
These seven topics already existed in the prior ChatGPT encyclopedia/prototype. **Inspect the repository for their actual contents**; the initial web prototype may be abridged, so do not assume it contains the complete original lessons.

1. **Classical music:** J. S. Bach, Antonio Vivaldi, W. A. Mozart, Ludwig van Beethoven, Bedřich Smetana, Antonín Dvořák. For Smetana, cover the six movements of *Má vlast* (Vyšehrad, Vltava, Šárka, Z českých luhů a hájů, Tábor, Blaník) and major operas (*Prodaná nevěsta*, *Libuše*, *Dalibor*, *Hubička*).
2. **20th-century dictators and authoritarian rulers:** Adolf Hitler, Joseph Stalin, Benito Mussolini, Mao Zedong, Francisco Franco, Pol Pot. Describe historical context and documented actions accurately, without glamorization.
3. **Film music:** John Williams, Hans Zimmer, Ennio Morricone, Howard Shore, James Horner.
4. **World literature:** William Shakespeare, Leo Tolstoy, Fyodor Dostoevsky, George Orwell, Ernest Hemingway, Franz Kafka, Victor Hugo, Miguel de Cervantes, Gabriel García Márquez, J. R. R. Tolkien, Agatha Christie, Johann Wolfgang von Goethe.
5. **Ancient civilizations:** Mesopotamia, ancient Egypt, ancient Greece, ancient Rome.
6. **South America:** Brazil, Argentina, Chile, Peru, Colombia, Venezuela, Uruguay.
7. **Czech Middle Ages:** Great Moravia, Cyril and Methodius (863), Přemyslid dynasty, Saint Wenceslaus (traditional date 935; explain scholarly uncertainty where relevant), Golden Bull of Sicily (1212), Wenceslaus III (1306), Luxembourg dynasty, Charles IV, Prague university (1348), Charles Bridge (construction began 1357).

**Possible next lesson:** Jan Hus and the Hussite movement, provided the repository does not already cover it. This is a suggestion, not a hardcoded queue.

## Real images: selection, licensing, reliability
- Prefer Wikimedia Commons and other reputable, openly licensed or public-domain collections. Use **specific, verified file pages**, not unreviewed fuzzy search results.
- For each image, store metadata with at least: subject, image URL or local path, source file/page URL, author/creator if known, license and license URL, and optional alt text/caption. Preserve attribution requirements, including share-alike obligations when applicable.
- Prefer stable Wikimedia Commons `Special:FilePath`/thumbnail URLs or locally stored **properly licensed** images. Check that URLs resolve and that the actual image matches the subject. A random image returned by search is not acceptable.
- Use meaningful Czech `alt` text; lazy-load images; include fallback if a remote image is blocked or missing. Respect remote-host policies and reasonable image dimensions.
- For ancient figures without authentic photographs, label artwork as a **historical depiction**, not a photograph. For modern individuals, prefer genuine portraits/photos.
- Avoid image generation for supposedly authentic portraits, monuments or documentary photographs.

## Website and UX
- Publish a **public**, responsive, accessible website via GitHub Pages; no login needed to read.
- Home page: topic categories, lesson cards, chronological/latest listing, and full-text search/filter.
- Each lesson: stable shareable URL, clear heading hierarchy, reading time, image captions and credits, substantive body, quiz and references, easy navigation back to index.
- Good mobile usability, readable typography, fast load, keyboard navigation, sufficient contrast, semantic HTML, descriptive links, accessible quiz controls.
- Prefer static generation or a lightweight static SPA compatible with GitHub Pages. Avoid unnecessary server infrastructure, databases, paid APIs, secrets in client code, or fragile build dependencies.
- **GitHub Pages project-site base path is `/general-knowledge/`**. Make routing, internal links and asset paths work under that prefix and on refresh/deep links; do not assume deployment at `/`.
- Content should be stored separately from presentation (Markdown/front matter, JSON or another documented schema). New lessons should not require hand-editing HTML templates.
- Maintain a consistent visual design. Do not replace verified historical images with decorative placeholders.

## Quality and checks
Before delivering a change:
1. Validate lesson schema/Markdown/front matter and unique IDs/slugs.
2. Check internal navigation, site base path, search, image fallbacks, quiz interactions and mobile layout.
3. Run existing tests/lint/build if configured; add lightweight automated checks when useful.
4. Verify external media URLs when possible, and flag links that could not be checked.
5. Review attribution and source metadata for newly added images.
6. Make focused, descriptive commits. Do not force-push or overwrite user changes. Prefer a branch/PR for substantial or potentially breaking changes; only push/deploy with the user's authorization and available credentials.

## Deployment
- Primary hosting: **GitHub Pages**, repository `ivochvojka/general-knowledge`.
- Favor GitHub Pages' built-in branch deployment for a simple root `index.html` site, or a minimal GitHub Actions workflow if a build step becomes necessary.
- Ensure repository Pages configuration matches the chosen method; do not mix both approaches accidentally.
- A successful Git commit is **not** proof of successful deployment. Verify GitHub Actions/Pages status and public URL when possible.
- GitHub Packages is **not required** for this static website.

## Lesson schedule and automation handoff
The previous **ChatGPT** recurring task was **disabled on 2026-11-06**. It had been scheduled for **Monday and Thursday at approximately 08:00, Europe/Prague**. Disabling it does **not** create a Codex automation.

Desired replacement: a **Codex automation** (if supported in the owner's environment) that runs **twice weekly, Monday and Thursday at 08:00 Europe/Prague**, and:
1. Reads this file, the lesson inventory, and recent git history.
2. Selects a fresh topic from the rotation, avoiding duplicates.
3. Researches and drafts one fully sourced Czech lesson of about four minutes.
4. Adds verified authentic images and complete attribution; if reliable images cannot be acquired, leaves explicit fallbacks rather than inventing assets.
5. Adds quiz and updates lesson index/search metadata.
6. Runs validation/build/tests.
7. Commits changes and, **only when explicitly authorized and technically supported**, pushes/publishes them; otherwise creates a PR or leaves a clear reviewable change summary.
8. Reports the lesson title, links, validation results and whether publication actually succeeded.

**Do not claim this automation is configured merely because this AGENTS.md exists.** The owner must configure/enable it in Codex or another supported scheduler, and verify that the environment has repo write access, network access for sources/images, and permission to publish. A scheduled run on a powered-off Mac may not execute depending on the scheduler; verify the actual runtime behavior.

### Suggested Codex automation prompt
> Read AGENTS.md and the current lessons in this repository. Prepare exactly one new, non-duplicative Czech general-knowledge lesson, following the topic rotation and four-minute format. Research and verify facts; select relevant genuine Wikimedia Commons or other properly licensed images with attribution; include a 3–5-question quiz. Update the content inventory, run all checks, and prepare a focused commit. Push/publish only if explicitly authorized and supported; otherwise provide a reviewable PR or changes. Report precisely what was created and what remains unverified.

## Working with previous content
The earlier spreadsheet and illustrated Excel were **intermediate prototypes**, not authoritative complete source documents. Some Excel images were generic illustrations; **do not reuse them as authentic portraits**. The first web prototype was explicitly abridged. If original full lesson text is unavailable in the repository, ask the owner for an export or reconstruct an accurate, newly researched full article rather than claiming a verbatim migration.

## Security and privacy
- Never commit GitHub PATs, credentials, API keys, `.env` secrets, or personal data.
- The owner uses separate personal and work GitHub identities. Confirm the remote points to `ivochvojka/general-knowledge` and the active credentials have access before pushing. Never change global Git credentials or affect corporate repositories as a workaround.
- Avoid paid services or introducing new third-party dependencies without explaining the trade-offs.

## Definition of done
A task is complete only when the requested files/content are actually present, checks have been run as feasible, and any deployment/scheduling claims are backed by verification. Communicate any remaining manual steps plainly.
