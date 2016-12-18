const assign = require('lodash.assign');
const parents = require('parents');
const runLoader = require('./lib/runLoader');

module.exports = function getConfig(loaders, opts) {
  const options = assign({
    cwd: process.cwd(),
    travel: true
  }, opts);

  const folders = options.travel
    ? parents(options.cwd)
    : [options.cwd];

  for (let folder of folders) {
    for (let i in loaders) {
      const result = runLoader(loaders[i], assign({}, options, {
        cwd: folder
      }));

      if (result instanceof Error) {
        throw result;
      }

      if (result !== false) {
        return result;
      }
    }
  }

  throw new Error('No config object could be found.');
}
