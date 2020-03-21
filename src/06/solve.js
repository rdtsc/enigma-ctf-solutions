#!/usr/bin/env node

'use strict';

const fs     = require('fs'),
      assert = require('assert'),
      enigma = require('~/lib/enigma');

function toKey(string)
{
  return string.replace(/\s/g, '')
               .split('')
               .sort()
               .join('');
}

const keywords = (() =>
{
  const result = {};

  const words = fs.readFileSync('./data/keywords.txt', 'utf8')
                  .split(/[\r\n]/)
                  .filter(line => line.length);

  for(const word of words)
  {
    result[toKey(word)] = word;
  }

  return result;
})();

(async (problemId = 6) =>
{
  const $ = await enigma.get(problemId);

  const $inputContainer = $('.style7');

  assert($inputContainer.length === 1);

  const inputs = $inputContainer.text()
                                .split(/[\r\n]/)
                                .map(line => line.trim())
                                .filter(line => line.length)
                                .map(line => toKey(line));

  assert(inputs.length === 20);

  const anagram = [];

  for(const key of inputs)
  {
    assert(key in keywords);

    anagram.push(keywords[key]);
  }

  const payload =
  {
    submit:  true,
    anagram: anagram.join(',')
  };

  console.log(await enigma.post(`${problemId}/submit.php`, payload));
})();
