'use strict';

const MAX_SIDE = 10;
const MAX_WORDS = 10000;

function findWords(grid, words) {
  if (!Array.isArray(grid) || !Array.isArray(words)) throw new TypeError('Grid and dictionary must be arrays.');
  if (grid.length === 0 || words.length === 0) return [];
  if (grid.length > MAX_SIDE || grid.some(row => typeof row !== 'string' || !/^[a-z]+$/.test(row))) {
    throw new Error('Grid must contain 1–10 rows of lowercase letters.');
  }
  const cols = grid[0].length;
  if (cols > MAX_SIDE || grid.some(row => row.length !== cols)) {
    throw new Error('Grid must be rectangular and at most 10 columns wide.');
  }
  if (words.length > MAX_WORDS) throw new Error('Dictionary limit is 10,000 words.');
  for (const word of words) {
    if (typeof word !== 'string' || !/^[a-z]{1,10}$/.test(word)) {
      throw new Error('Dictionary words must be lowercase and 1–10 letters long.');
    }
  }

  const root = { next: new Map(), word: null };
  for (const word of new Set(words)) {
    let node = root;
    for (const letter of word) {
      if (!node.next.has(letter)) node.next.set(letter, { next: new Map(), word: null });
      node = node.next.get(letter);
    }
    node.word = word;
  }

  const rows = grid.length;
  const visited = new Uint8Array(rows * cols);
  const path = [];
  const found = new Map();
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  function walk(row, col, parent) {
    const index = row * cols + col;
    if (visited[index]) return;
    const node = parent.next.get(grid[row][col]);
    if (!node) return;
    visited[index] = 1;
    path.push([row, col]);
    if (node.word !== null) {
      found.set(node.word, path.map(([r, c]) => [r, c]));
      node.word = null;
    }
    if (node.next.size > 0) {
      for (const [dr, dc] of directions) {
        const nr = row + dr, nc = col + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr * cols + nc]) walk(nr, nc, node);
      }
    }
    path.pop();
    visited[index] = 0;
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) walk(row, col, root);
  }
  return [...found.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([word, wordPath]) => ({ word, path: wordPath }));
}

module.exports = { findWords };
if (typeof window !== 'undefined') window.findWords = findWords;
