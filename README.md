# The Expedition's Lost Words

A browser-based word recovery tool for rectangular lowercase grids (up to 10×10) and dictionaries of up to 10,000 words (up to 10 letters each).

## Run

Open `word-recovery.html` in a modern browser. Keep `word-recovery.js` beside it; the page loads the search engine from that file. No server or network connection is required.

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
