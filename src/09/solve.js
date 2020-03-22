#!/usr/bin/env node

'use strict';

const path   = require('path'),
      chunk  = require('lodash.chunk'),
      assert = require('assert'),
      linear = require('linear-solve'),
      enigma = require('~/lib/enigma');

function serializeBoard($, selector = '#game_grid')
{
  const gameBoardWidth = 6;

  const $grid = $(selector);

  assert($grid.length === 1);

  const $rows = $('tr', $grid).filter(function()
  {
    return $('td', this).length === gameBoardWidth;
  });

  const gameBoard = $rows.map(function()
  {
    return $('td', this).map(function()
    {
      const $img = $('img', this);

      if($img.length)
      {
        const {name} = path.parse($img.attr('src'));

        return name.toLowerCase();
      }

      return $(this).text().trim();
    }).get();
  }).get();

  assert(gameBoard.length === gameBoardWidth * (gameBoardWidth - 1));

  return chunk(gameBoard, gameBoardWidth);
}

function getShapes($)
{
  const toName = (i, element) =>
    $(element).attr('name').toLowerCase().trim();

  return $('form input[type="text"]').map(toName).get();
}

function getShapeValues(shapes, board)
{
  const coefficients = [],
        constants    = [];

  const count = (row, shape) =>
    row.filter(cell => cell === shape).length;

  for(const row of board)
  {
    const coeffRow = [];

    for(const shape of shapes)
    {
      coeffRow.push(count(row, shape));
    }

    coefficients.push(coeffRow);

    constants.push(+row.slice(-1)[0]);
  }

  const values = linear.solve(coefficients, constants)
                       .map(Math.round);

  assert(values.length === shapes.length);

  const result = {};

  for(let i = 0; i < shapes.length; ++i)
  {
    result[shapes[i]] = values[i];
  }

  return result;
}

(async function solve(problemId = 9)
{
  const $ = await enigma.get(problemId);

  const shapes = getShapes($),
        board  = serializeBoard($);

  try
  {
    const payload = getShapeValues(shapes, board);

    payload.submit = 'Submit';

    console.log(await enigma.post(problemId, payload));
  }

  catch(error)
  {
    return setTimeout(solve, 1000);
  }
})();
