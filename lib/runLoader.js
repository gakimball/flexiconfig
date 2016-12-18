const assign = require('lodash.assign');
const fs = require('fs');
const isEmptyObject = require('is-empty-object');
const isObject = require('is-object');
const path = require('path');
const yaml = require('js-yaml').safeLoad;

/**
 * Run a loader and figure out if it works.
 * @param {(Object|String)} Loader to test.
 * @param {Object} [opts] - Plugin options.
 * @returns {(Object|Boolean)} Found config object, or `false` if it turned up empty.
 */
module.exports = function runLoader(loader, opts) {
  const options = assign({
    cwd: process.cwd(),
    format: 'both',
    travel: true
  }, opts);

  // Parsing objects
  if (isObject(loader)) {
    if (isEmptyObject(loader)) {
      return false;
    }
    else {
      return loader;
    }
  }

  // Parsing files
  else if (typeof loader === 'string') {
    // Parsing a package.json key
    if (loader.indexOf('package.json#') === 0) {
      const filePath = path.join(options.cwd, 'package.json');
      const key = filePath.replace('package.json#', '');

      try {
        const package = require(filePath);

        if (package[key]) {
          if (!isObject(package[key])) {
            return new Error(`The "${key}" property in package.json is not an object.`);
          }
          else {
            return package[key];
          }
        }
        else {
          return false;
        }
      }
      catch (e) {
        return false;
      }
    }
    // Parsing a regular file
    else {
      const filePath = path.join(options.cwd, loader);
      let contents;

      try {
        contents = fs.readFileSync(filePath).toString();
      }
      catch (e) {
        return false;
      }

      switch (options.format) {
        case 'both': {
          try {
            return JSON.parse(contents);
          }
          catch (e) {
            try {
              return yaml(contents);
            }
            catch (e) {
              return new Error(`Could not parse ${filePath} as JSON or YAML.`);
            }
          }

          break;
        }
        case 'json': {
          try {
            return JSON.parse(contents);
          }
          catch (e) {
            return new Error(`Could not parse ${filePath} as JSON.`);
          }

          break;
        }
        case 'yml': {
          try {
            return yaml(contents);
          }
          catch (e) {
            return new Error(`Could not parse ${filePath} as YAML.`);
          }
        }
      }
    }
  }

  // Any other non-string, non-object value is not a match
  else {
    return false;
  }
}
