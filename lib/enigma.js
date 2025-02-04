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

module.exports.request = (config, setReferrer = true) =>
{
  config.url = resolveEndpoint(config.url);

  const referer = config.url.includes('/programming/4/') ?
                  resolveEndpoint('4/index.php') :
                  setReferrer ? config.url : '';

  const client = axios.create
  ({
    headers:
    {
      referer,
      'cookie':     `mission=yes;${require('~/session')}`,
      'user-agent': ' '
    }
  });

  return client.request(config);
};

module.exports.get = async (endpoint, responseType = 'document') =>
{
  const axiosResponseType =
    responseType === 'result' ? 'document' : responseType;

  responseType = responseType.trim().toLowerCase();

  const response = await exports.request
  ({
    method: 'get',
    url: endpoint,
    responseType: axiosResponseType
  });

  assert(response.status === 200);

  if(responseType === 'document')
  {
    return cheerio.load(response.data);
  }

  if(responseType === 'result')
  {
    return getEnigmaResponseText(response.data);
  }

  return response;
};

module.exports.post = async (endpoint,
                             data = {},
                             setReferrer = true,
                             responseType = 'document') =>
{
  responseType = responseType.trim().toLowerCase();

  const response = await exports.request
  ({
    method: 'post',
    url: endpoint,
    data: qs.stringify(data),
    responseType
  }, setReferrer);

  assert(response.status === 200);

  if(responseType === 'document')
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
