'use strict';

function unscramble(scrambled)
{
  const canvas  = document.createElement('canvas'),
        context = canvas.getContext('2d');

  canvas.width  = scrambled.width;
  canvas.height = scrambled.height;

  context.drawImage(scrambled, 0, 0);

  const scrambledRows = {};

  for(let y = 0; y < canvas.height; ++y)
  {
    const key = Array.from(context.getImageData(0, y, 1, 1).data)
                     .slice(0, 3)
                     .map(i => `0${i.toString(16)}`.substr(-2))
                     .join('');

    scrambledRows[key] = context.getImageData(0, y, canvas.width, 1);
  }

  const orderedRows = Object.keys(scrambledRows)
                            .sort()
                            .map(key => scrambledRows[key]);

  for(let y = 0; y < canvas.height; ++y)
  {
    context.putImageData(orderedRows[y], 0, y);
  }

  return canvas;
}

document.addEventListener('DOMContentLoaded', () =>
{
  const scrambled   = document.querySelector('img'),
        unscrambled = unscramble(scrambled);

  document.body.appendChild(unscrambled);
});
