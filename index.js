const runLoader = require('./lib/runLoader');

module.exports = function getConfig(loaders, options) {
  for (let i in loaders) {
    const result = runLoader(loaders[i], options);

    if (result instanceof Error) {
      throw result;
    }

    if (result !== false) {
      return result;
    }
  }

  throw new Error('No config object could be found.');
}
