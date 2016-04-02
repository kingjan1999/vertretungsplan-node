# vertretungsplan

<p align="center">
  <a href="https://npmjs.org/package/vertretungsplan">
    <img src="https://img.shields.io/npm/v/vertretungsplan.svg?style=flat-square"
         alt="NPM Version">
  </a>

  <a href="https://coveralls.io/r/kingjan1999/vertretungsplan-node">
    <img src="https://img.shields.io/coveralls/kingjan1999/vertretungsplan-node.svg?style=flat-square"
         alt="Coverage Status">
  </a>

  <a href="https://travis-ci.org/kingjan1999/vertretungsplan">
    <img src="https://img.shields.io/travis/kingjan1999/vertretungsplan-node.svg?style=flat-square"
         alt="Build Status">
  </a>

  <a href="https://npmjs.org/package/vertretungsplan">
    <img src="http://img.shields.io/npm/dm/vertretungsplan.svg?style=flat-square"
         alt="Downloads">
  </a>

  <a href="https://david-dm.org/kingjan1999/vertretungsplan-node.svg">
    <img src="https://david-dm.org/kingjan1999/vertretungsplan-node.svg?style=flat-square"
         alt="Dependency Status">
  </a>

  <a href="https://github.com/kingjan1999/vertretungsplan-node/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/vertretungsplan.svg?style=flat-square"
         alt="License">
  </a>
</p>

<p align="center"><big>

</big></p>

Module for parsing untis substituon plans.

[Java](https://github.com/kingjan1999/vertretungsplan-java)
[PHP](https://github.com/kingjan1999/vertretungsplan-php)

## Install

```sh
npm i --save vertretungsplan
```

## Usage

```js
import Vertretungsplan from "vertretungsplan"

var plan = new Vertretungsplan("http://ohgspringe.de/phocadownload/plan/subst_001.htm")
plan.load();

console.log(plan.getForClass("11")); //Array

```

## Notice

- The keys are determined by the column-headings of the url.
- The keys are lowercased ('(Raum)' => '(raum)')
- For convenience, 'Klasse(n)' becomes 'klasse'

## License

MIT © [kingjan1999](http://github.com/kingjan1999)

[npm-url]: https://npmjs.org/package/vertretungsplan
[npm-image]: https://img.shields.io/npm/v/vertretungsplan.svg?style=flat-square

[travis-url]: https://travis-ci.org/kingjan1999/vertretungsplan
[travis-image]: https://img.shields.io/travis/kingjan1999/vertretungsplan.svg?style=flat-square

[coveralls-url]: https://coveralls.io/r/kingjan1999/vertretungsplan
[coveralls-image]: https://img.shields.io/coveralls/kingjan1999/vertretungsplan.svg?style=flat-square

[depstat-url]: https://david-dm.org/kingjan1999/vertretungsplan
[depstat-image]: https://david-dm.org/kingjan1999/vertretungsplan.svg?style=flat-square

[download-badge]: http://img.shields.io/npm/dm/vertretungsplan.svg?style=flat-square
