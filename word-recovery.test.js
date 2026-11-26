'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { findWords } = require('./word-recovery.js');

test('finds dictionary words and reconstructs a legal path', () => {
  const grid = ['oaan', 'etae', 'ihkr', 'iflv'];
  const results = findWords(grid, ['oath', 'pea', 'eat', 'rain']);
  assert.deepEqual(results.map(item => item.word).sort(), ['eat', 'oath']);
  for (const { word, path } of results) {
    assert.equal(path.length, word.length);
    assert.equal(new Set(path.map(([r, c]) => `${r},${c}`)).size, path.length);
    for (let i = 0; i < path.length; i++) {
      const [r, c] = path[i];
      assert.equal(grid[r][c], word[i]);
      if (i) {
        const [pr, pc] = path[i - 1];
        assert.equal(Math.abs(pr - r) + Math.abs(pc - c), 1);
      }
    }
  }
});

test('handles repeated letters, shared prefixes, duplicates and absent words', () => {
  const results = findWords(['aaa', 'aba'], ['aaa', 'aab', 'aba', 'ab', 'aaa', 'zzz']);
  assert.deepEqual(results.map(item => item.word).sort(), ['aaa', 'aab', 'ab', 'aba']);
  assert.equal(results.filter(item => item.word === 'aaa').length, 1);
});

test('returns no results for an empty dictionary or empty grid', () => {
  assert.deepEqual(findWords(['ab'], []), []);
  assert.deepEqual(findWords([], ['a']), []);
});

test('prunes a large shared-prefix dictionary and returns only present words', () => {
  const words = Array.from({ length: 9998 }, (_, i) => {
    let n = i, suffix = '';
    for (let j = 0; j < 4; j++) { suffix = String.fromCharCode(97 + n % 26) + suffix; n = Math.floor(n / 26); }
    return `ab${suffix}`;
  });
  words.push('abca', 'abcd');
  const results = findWords(['abca', 'xxxx', 'xxxx', 'xxxx'], words);
  assert.deepEqual(results.map(item => item.word), ['abca']);
});

test('rejects malformed grids and non-lowercase words', () => {
  assert.throws(() => findWords(['ab', 'c'], ['a']), /rectangular/i);
  assert.throws(() => findWords(['AB'], ['ab']), /lowercase/i);
  assert.throws(() => findWords(['ab'], ['A']), /lowercase/i);
});
