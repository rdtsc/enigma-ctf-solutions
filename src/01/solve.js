'use strict';

const enigma   = require('~/lib/enigma'),
      publicIp = require('public-ip');

(async (problemId = 1) =>
{
  const payload =
  {
    ip:       await publicIp.v4(),
    username: await enigma.getUsername()
  };

  console.log(await enigma.post(problemId, payload));
})();
