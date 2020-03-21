'use strict';

const enigma = require('~/lib/enigma');

(async (problemId = 2) =>
{
  const $ = await enigma.get(problemId);

  const payload = $('form').serializeArray().reduce((entries, input) =>
  {
    return {...entries, [input.name]: input.value}
  }, {});

  payload.submit = 'Submit Answer';
  payload.answer = $('input[name*="number"]').val() * 4;

  console.log(await enigma.post(problemId, payload));
})();
