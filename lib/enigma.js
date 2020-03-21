'use strict';

const qs      = require('querystring'),
      url     = require('url'),
      assert  = require('assert'),
      axios   = require('axios'),
      cheerio = require('cheerio');

function resolveEndpoint(endpoint)
{
  endpoint = endpoint.toString();

  if(!url.parse(endpoint).host)
  {
    const baseUrl = 'http://challenges.enigmagroup.org/programming/';

    if(/^\d+$/.test(endpoint))
    {
      endpoint += '/';
    }

    return url.resolve(baseUrl, endpoint);
  }

  return endpoint;
}

function getEnigmaResponseText(html)
{
  const toText = (html) =>
  {
    const tag = (name) =>
      new RegExp(`<\s*\/?\s*${name}\s*>`, 'g');

    html = html.replace(tag `i`, ' ')
               .replace(tag `b`, ' ')
               .replace(tag `br`, '\n')
               .split('\n')
               .map(line => line.replace(/\s+/g, ' ').trim())
               .join('\n');

    return cheerio.load(html).text().trim();
  };

  const $ = cheerio.load(html);

  const $fragments = $('font[color="red"]').map(function()
  {
    return toText($(this).html());
  });

  return $fragments.get().join('\n');
}

module.exports.request = (config) =>
{
  config.url = resolveEndpoint(config.url);

  const client = axios.create
  ({
    headers:
    {
      'referer':    config.url,
      'cookie':     `mission=yes;${require('~/session')}`,
      'user-agent': ' '
    }
  });

  return client.request(config);
};

module.exports.get = async (endpoint, responseType = 'document') =>
{
  const response = await exports.request
  ({
    method: 'get',
    url: endpoint,
    responseType
  });

  assert(response.status === 200);

  if(responseType.trim().toLowerCase() === 'document')
  {
    return cheerio.load(response.data);
  }

  return response;
};

module.exports.post = async (endpoint, data = {}, responseType = 'document') =>
{
  const response = await exports.request
  ({
    method: 'post',
    url: endpoint,
    data: qs.stringify(data),
    responseType
  });

  assert(response.status === 200);

  if(responseType.trim().toLowerCase() === 'document')
  {
    return getEnigmaResponseText(response.data);
  }

  return response;
};

module.exports.getUsername = async () =>
{
  const $ = await exports.get('https://www.enigmagroup.org/');

  const profileLinkElement = $('a').filter(function()
  {
    const $this = $(this);

    return $this.attr('href').startsWith('/profile/') &&
           $this.text().trim().toLowerCase() === 'my profile';
  }).first();

  assert(profileLinkElement.length === 1);

  return profileLinkElement.attr('href')
                           .split('/')
                           .map(s => s.trim())
                           .filter(s => s.length)
                           .pop();
};
