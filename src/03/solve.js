#!/usr/bin/env node

'use strict';

const enigma   = require('~/lib/enigma'),
      {decode} = require('jpeg-asm');

(async (problemId = '3/image.php') =>
{
  const {data: img} = await enigma.get(problemId, 'arraybuffer');

  const payload =
  {
    submit: 1,
    color:  new Uint8Array(decode(img).buffer, 0, 3).join(';')
  };

  console.log(await enigma.post(problemId, payload));
})();
