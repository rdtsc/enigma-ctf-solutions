#!/usr/bin/env node

'use strict';

const {PNG}  = require('pngjs'),
      chunk  = require('lodash.chunk'),
      assert = require('assert'),
      enigma = require('~/lib/enigma');

function decodeImage(data)
{
  const img = PNG.sync.read(data);

  const area = img.width * img.height;

  assert(area && !(area % 8));

  const payload = [];

  for(let y = 0; y < img.height; ++y)
  for(let x = 0; x < img.width;  ++x)
  {
    const i = (img.width * y + x) << 2;

    payload.push(+!img.data[i]);
  }

  return chunk(payload, 8).map(bin => parseInt(bin.join(''), 2))
                          .map(int => String.fromCharCode(int))
                          .join('');
}

(async (problemId = '4/image.php') =>
{
  const {data: img} = await enigma.get(problemId, 'arraybuffer');

  const [preamble, answer] = decodeImage(img).split(':');

  console.log(await enigma.post(problemId, {answer}));
})();
