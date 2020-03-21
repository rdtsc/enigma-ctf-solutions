#!/usr/bin/env node

'use strict';

const qs        = require('querystring'),
      assert    = require('assert'),
      enigma    = require('~/lib/enigma'),
      Brainfuck = require('brainfuck-node');

(async (problemId = 5) =>
{
  const $ = await enigma.get(problemId);

  const code = $('div').filter(function()
  {
    const $this = $(this);

    const ownText = $this.contents()
                         .not($this.children())
                         .text();

    return ownText.includes('+'.repeat(8));
  });

  assert(code.length === 1);

  const bf = new Brainfuck();

  const {output} = bf.execute(code.text().trim());

  const payload = qs.stringify({ans: output});

  console.log(await enigma.get(`${problemId}?${payload}`, 'result'));
})();
