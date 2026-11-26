# The Expedition's Lost Words

A browser-based word recovery tool for rectangular lowercase grids (up to 10×10) and dictionaries of up to 10,000 words (up to 10 letters each).

## Run

- Open `index.html` (the deployed entry point) or `word-recovery.html` for the local UI. Keep `word-recovery.js` beside it; no server or network connection is required.

## Use

- Load the illustrated example or the unseen repeated-letter demo.
- Edit cells by clicking them; use the row and column controls to resize the grid.
- Enter candidate words separated by spaces, commas, or semicolons, then choose **Recover words**.
- Select a result to highlight its path. Coordinates are 1-based `(row, column)`.

## Search approach

The dictionary is stored as a trie, so words with shared prefixes share nodes. Depth-first search starts at each cell and follows only orthogonal neighbors that match a trie edge. A visited bitmap prevents reusing a cell on a current path; backtracking unmarks cells for other paths. A discovered trie terminal is cleared so duplicate dictionary entries and alternate routes do not return a word more than once. Results are sorted alphabetically and include one reconstructed path apiece.

## Tests

With Node.js installed, from this folder run:

```sh
node --test word-recovery.test.js
```

The suite covers the prompt's example, path legality, repeated letters, shared prefixes, duplicates, absent words, empty inputs, a 10,000-word shared-prefix dictionary, and invalid input.

## Deploy on Vercel

This is a static site with no build step. Push the repo (index.html, word-recovery.js, package.json, README.md, vercel.json) to GitHub and import it into Vercel:

1. Create a new GitHub repository and push this folder to its root.
2. In the Vercel Dashboard, click **Add New** → **Project** → **Import Git Repository**.
3. Select the repository, keep the default preset (**Other** / **Static** — Vercel detects index.html automatically).
4. Set the install command to `npm i` (only installs the lockfile; no dependencies are required) and the build command to `npm run build` (a no-op echo for static sites).
5. Leave the root directory as the repo root and click **Deploy**.

Deploy output: Vercel serves `index.html` at `/`. The engine loads from `word-recovery.js` automatically. The app runs fully client-side with no API calls, so no serverless function is needed.

### One-click import (if you prefer not to push to GitHub)

The repository `word-recovery` is also a valid Vercel remote template repository. In the Vercel Dashboard, create a project and paste the repository URL; Vercel will detect the static preset and deploy automatically.

## Folder layout

```
.
├── index.html
├── word-recovery.js
├── word-recovery.test.js
├── package.json
├── vercel.json
└── README.md
```
