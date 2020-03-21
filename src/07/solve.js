#!/usr/bin/env node

'use strict';

const assert = require('assert'),
      enigma = require('~/lib/enigma');

function getCompany($)
{
  const $container = $('#inner');

  assert($container.length === 1);

  const body =
    $container.html().replace(/<\s*br\s*\/?\s*>/g, '\n');

  const matches = /company:\s*(.*?)$/im.exec(body);

  assert(matches.length === 2);

  return matches[1].trim();
}

function getDepartment($)
{
  const $container = $('#inner');

  assert($container.length === 1);

  const matches =
    /steal.*?from.*?the\s+(.*?)\s+department/i.exec($container.text());

  assert(matches.length === 2);

  return matches[1].trim();
}

function getDepartmentBudget($, department)
{
  department = department.toLowerCase();

  const $container = $('#inner');

  assert($container.length === 1);

  const lines = $container.text()
                          .toLowerCase()
                          .split(/department\s*:\s*/i)
                          .map(line => line.trim())
                          .filter(line => line.startsWith(department))
                          .map(line => line.split(':')[1])
                          .map(value => +value.replace(/\D/g, ''));

  return lines.reduce((lhs, rhs) => lhs + rhs);
}

(async (problemId = 7) =>
{
  const $ = await enigma.get(problemId);

  const company    = getCompany($),
        department = getDepartment($),
        total      = getDepartmentBudget($, department);

  const payload =
  {
    company,
    department,
    total
  };

  console.log(await enigma.post(`${problemId}/submit.php`, payload));
})();
