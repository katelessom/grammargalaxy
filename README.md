# Grammar Galaxy

A responsive English grammar website with three space-themed games:

- Rocket Race
- Starship Repair
- Alien Codebreaker

Student profiles, progress, mistakes, rewards, purchases and settings are stored locally in the browser.

## Included features

- 586 grammar tasks from A1 to C1; every selectable topic has at least 10 tasks
- a personal collection of 30 learned irregular verbs
- non-repeating task selection that prioritizes unseen questions
- automatic checking, explanations and a mistake review after every mission
- XP, Stardust, nine unlockable achievements and a cabin decoration shop
- a dedicated animated cabin screen in the five-button mobile navigation
- distinct game presentation: timed race, full-sentence repair and alien decoding
- editable student name, avatar and default CEFR level
- separate named music tracks for every game and location, plus a generated fallback
- twelve different sound effects for navigation, flight, repairs, code fragments, purchases, cabin placement, hints and rewards
- an audio panel with independent music and effects controls on every screen
- responsive layouts for phones, tablets and computers
- animated interface and optional Stardust cursor trail

## Run locally

1. Install Node.js 22 or later.
2. Open this folder in VS Code.
3. Run `npm install`.
4. Run `npm run dev`.

## Publish on GitHub Pages

1. Create a GitHub repository.
2. Upload the complete project, including the `.github` folder.
3. Open **Settings → Pages** in the repository.
4. Select **GitHub Actions** as the source.
5. Push to the `main` branch. The included workflow builds and publishes the site automatically.

## Add the Suno music

Put the eight MP3 files in `public/audio`. Keep the exact names listed in
`public/audio/README.txt`. The website already works before they are added and
uses a quiet generated ambient fallback; after the files are added, every area
automatically plays its own soundtrack.

Do not upload only the `dist` folder: keep the source files and the deployment workflow in the repository.
