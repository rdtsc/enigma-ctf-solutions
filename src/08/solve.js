#!/usr/bin/env node

'use strict';

const fs     = require('fs'),
      cp     = require('child_process'),
      temp   = require('temp'),
      {PNG}  = require('pngjs'),
      assert = require('assert'),
      enigma = require('~/lib/enigma');

temp.track();

const toHexByte = (value) =>
  `0${value.toString(16)}`.substr(-2);

const getPixel = (img, x, y) =>
[
  img.data[(img.width * y + x) * 4 + 0],
  img.data[(img.width * y + x) * 4 + 1],
  img.data[(img.width * y + x) * 4 + 2]
];

const getRow = (img, y) =>
  [...Array(img.width).keys()].map(x => getPixel(img, x, y));

function setPixel(img, x, y, data)
{
  assert(data.length === 3);

  for(let i = 0; i < 3; ++i)
  {
    img.data[(img.width * y + x) * 4 + i] = data[i];
  }
}

function setRow(img, y, data)
{
  assert(img.width === data.length);

  for(let x = 0; x < img.width; ++x)
  {
    setPixel(img, x, y, data[x]);
  }
}

function unscramble(img)
{
  img = PNG.sync.read(img);

  const scrambledRows = {};

  for(let y = 0; y < img.height; ++y)
  {
    const key = getPixel(img, 0, y).map(toHexByte).join('');

    scrambledRows[key] = getRow(img, y);
  }

  const orderedRows = Object.keys(scrambledRows)
                            .sort()
                            .map(key => scrambledRows[key]);

  for(let y = 0; y < img.height; ++y)
  {
    setRow(img, y, orderedRows[y]);
  }

  return PNG.sync.write(img);
}

(async (problemId = '8/image.php') =>
{
  const {data: img} = await enigma.get(problemId, 'arraybuffer');

  const imgPath = temp.openSync({suffix: '.png'}).path;

  fs.writeFileSync(imgPath, unscramble(img));

  const answer = cp.execSync(`gocr -C 0-9A-Z "${imgPath}"`)
                   .toString()
                   .trim();

  console.log(await enigma.post(problemId, {submit: 1, answer}));
})();
