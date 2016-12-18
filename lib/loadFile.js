const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml').safeLoad;

/**
 * Load a file using the file path and plugin options passed from `runLoader()`.
 * @param {String} loader - File path.
 * @param {Object} options - Plugin options.
 */
module.exports = function loadFile(loader, options) {
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
