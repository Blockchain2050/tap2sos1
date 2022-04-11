# json-eval

[![Known Vulnerabilities][snyk-image]][snyk-url]
[![Linux Build Status][linux-image]][linux-url]
[![Mac Build Status][mac-image]][mac-url]
[![Windows Build Status][windows-image]][windows-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![License][license-image]][license-url]

This function is a drop-in replacement for `eval()` used for the purpose of 
parsing JSON-like strings into valid JS objects. However, it does not actually 
run `eval()`, thereby averting the damage that executing insecure code can 
cause. It first attempts to parse the string with [JSON5](http://json5.org), so 
in most cases, it is a drop-in replacement for `JSON5.parse()`.

The recommended syntax for the submitted string is that it be valid JSON5. 
However, this function was expressly created to parse the quoting and special 
character escaping scheme employed by Pattern Lab PHP. When encountering that 
syntax, it will traverse the submitted string and wrap the keys and values in 
double-quotes as necessary.

### Use

CLI:

```shell
npm install json-eval
```

Node.js:

```javascript
const jsonEval = require('json-eval');
const jsObject = jsonEval(jsonLikeString);
```

Browser (ES5):

```html
<script src="json-eval/dist/json-eval.min.js"></script>
<script>
  var jsonEval = window.jsonEval;
  var jsObject = jsonEval(jsonLikeString);
</script>
```

Browser (ES6):

```html
<script type="module">
  import jsonEval from 'json-eval/dist/json-eval.es6.min.js';
  const jsObject = jsonEval(jsonLikeString);
</script>
```

[snyk-image]: https://snyk.io/test/github/electric-eloquence/json-eval/master/badge.svg
[snyk-url]: https://snyk.io/test/github/electric-eloquence/json-eval/master

[linux-image]: https://github.com/electric-eloquence/json-eval/workflows/Linux%20build/badge.svg?branch=master
[linux-url]: https://github.com/electric-eloquence/json-eval/actions?query=workflow%3A"Linux+build"

[mac-image]: https://github.com/electric-eloquence/json-eval/workflows/Mac%20build/badge.svg?branch=master
[mac-url]: https://github.com/electric-eloquence/json-eval/actions?query=workflow%3A"Mac+build"

[windows-image]: https://github.com/electric-eloquence/json-eval/workflows/Windows%20build/badge.svg?branch=master
[windows-url]: https://github.com/electric-eloquence/json-eval/actions?query=workflow%3A"Windows+build"

[coveralls-image]: https://img.shields.io/coveralls/electric-eloquence/json-eval/master.svg
[coveralls-url]: https://coveralls.io/r/electric-eloquence/json-eval

[license-image]: https://img.shields.io/github/license/electric-eloquence/json-eval.svg
[license-url]: https://raw.githubusercontent.com/electric-eloquence/json-eval/master/LICENSE
