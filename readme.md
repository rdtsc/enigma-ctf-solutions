# Enigma Group CTF Solutions

This repository houses my personal solutions to
[Enigma Group's programming challenges][challenges].

It is strongly encouraged that you do not view my solutions unless you've
already solved the relevant problems yourself.


## Background

Each challenge consists of some non-static dataset that must be processed
according to the problem statement and submitted back to to the specified URI
via a `GET` or `POST` request. Assuming a correct and timely submission, points
are credited to your account.

Most challenges have a dataset/solution TTL of a few seconds, so performance
isn't that important.


## Prerequisites

### Session Cookies

Authentication is cookie-based. The current workflow of getting and storing
session cookies is as follows:

- Manually log in to the site,
- Open devtools and grab the `PHPSESSID` cookie,
- Save the cookie in `/session.json`.

Given the relatively low number of published programming challenges at the time
of this writing, automation of the above steps does not seem warranted.

### Local Environment

- Linux
- Node.js >= v12.16.1


## Development Notes

The `/session.json` file changes relatively often. In order to not pollute the
commit log, set the `assume-unchanged` bit on it after cloning:

```text
$ git update-index --assume-unchanged session.json
```


## License and Copyright

All original code is released under the [MIT license][mit], unless otherwise
specified.

All referenced product names, trademarks, logos, and images are property of
their respective owners.


[challenges]: https://www.enigmagroup.org/pages/programming/
              "The Enigma Group - Programming Challenges"

[mit]: http://opensource.org/licenses/MIT/
       "The MIT License (MIT)"
