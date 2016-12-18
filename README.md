# flexiconfig

> Consume library configuration from multiple places

[![Travis](https://img.shields.io/travis/gakimball/flexiconfig.svg?maxAge=2592000)](https://travis-ci.org/gakimball/flexiconfig) [![npm](https://img.shields.io/npm/v/flexiconfig.svg?maxAge=2592000)](https://www.npmjs.com/package/flexiconfig)

If you have a library that involves large configuration, you might want to give users multiple ways to load the configuration, such as:

- Passing an object directly to your library's function
- Loading from a file `.kittensrc`
- Reading from a property of `package.json`

This library allows you to set those, in any preference order you want. The first configuration method that yields a result will be returned as an object.

## Installation

```bash
npm install flexiconfig
```

## Usage

In the below example, the `getConfig()` function will try to load first from the `opts` object passed to the function, then from a file called `.kittensrc` in the current working directory, and finally in `package.json`, under the top-level key `"kittens"`. If none of those work, it will move up one folder and try again, and on and on.

```js
const getConfig = require('flexiconfig');

module.exports = function getKittens(opts) {
  const options = getConfig([opts, '.kittensrc', 'package.json#kittens']);
}
```

## API

### getConfig(loaders[, options])

Produce a configuration object from the first source that yields one.

- **loaders** (Array): sources to try. Each item can be:
  - An object: if the object has properties, then it's a match. If it has no properties, it's skipped.
  - A string: filename to load from the current working directory, to be parsed in its entirety. It can be JSON or YML, and you can configure which formats are allowed.
  - A string with the format `package.json#[KEY]`, where `[KEY]` is a top-level key on the `package.json` in the current working directory.
- **options** (Object): lookup configuration.
  - **cwd** (String): directory to look for files in. Defaults to `process.cwd()`.
  - **format** (String): restrict the format of a loaded config file to either `json` or `yml`. By default, either can be used&mdash;the file will be parsed as JSON first, and then as YML if that fails.
  - **travel** (Boolean): if no configs are found in the current working directory, the next folder up will be searched next, and on and on until something is found. Defaults to `true`.

Returns the first config object found based on the order of `loaders`. Throws an error on any of these conditions:

- No config object is found after trying every option.
- A matching config file is found, but can't be parsed as valid JSON or YML.
- A matching key on `package.json` is found, but the value is not an object.

**Hot tip!** If you're okay with the process silently failing, you can supply a default config object as the last item in the `loaders` parameter.

```js
const getConfig = require('flexiconfig');

module.exports = function getKittens(opts) {
  const options = getConfig([opts, '.kittensrc', 'package.json#kittens', {
    breed: 'siamese',
    age: 12,
  }]);
}
```

## Local Development

```bash
git clone https://github.com/gakimball/flexiconfig
cd flexiconfig
npm install
npm test
```

## License

MIT &copy; [Geoff Kimball](http://geoffkimball.com)
