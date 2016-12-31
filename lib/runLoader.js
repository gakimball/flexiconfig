'use strict';

const assign = require('lodash.assign');
const isEmptyObject = require('is-empty-object');
const isObject = require('is-object');
const path = require('path');
const loadFile = require('load-whatever').sync;

/**
 * Run a loader and figure out if it works.
 * @param {(Object|String)} Loader to test.
 * @param {Object} [opts] - Plugin options.
 * @returns {(Object|Boolean)} Found config object, or `false` if it turned up empty.
 */
module.exports = function runLoader(loader, opts) {
  const options = assign({
    cwd: process.cwd()
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
      const key = loader.replace('package.json#', '');

      try {
        const pkg = require(filePath);

        if (key in pkg) {
          if (!isObject(pkg[key])) {
            return new Error(`The "${key}" property in package.json is not an object.`);
          }
          else {
            return pkg[key];
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
      try {
        const filePath = path.join(options.cwd, loader);
        return loadFile(filePath);
      }
      catch (e) {
        if (e.code === 'ENOENT' || e.code === 'MODULE_NOT_FOUND') {
          return false;
        }
        else {
          return e;
        }
      }
    }
  }

  // Any other non-string, non-object value is not a match
  else {
    return false;
  }
}
