const expect = require('chai').expect;
const getConfig = require('.');
const path = require('path');
const runLoader = require('./lib/runLoader');

describe('runLoader()', () => {
  // In the below tests, these three terms are used to describe the outcome of a loader:
  //   - "pass": config object is valid
  //   - "skip": config object was not found
  //   - "fail": config object was malformed
  // A "skip" is considered a passable error, while a "fail" is considered a hard error.

  it('passes a non-empty object', () => {
    expect(runLoader({ kittens: true })).to.be.an('object');
  });

  it('skips an empty object', () => {
    expect(runLoader({})).to.be.false;
  });

  it('skips non-string, non-object values', () => {
    expect(runLoader(false)).to.be.false;
  });

  it('passes a file formatted as JSON', () => {
    expect(runLoader('fixtures/test.json')).to.be.an('object');
  });

  it('passes a file formatted as YML', () => {
    expect(runLoader('fixtures/test.yml')).to.be.an('object');
  });

  it('fails a file that is not valid JSON or YML', () => {
    expect(runLoader('fixtures/.failrc')).to.be.an.instanceOf(Error);
  });

  it('allows a specific CWD to be set', () => {
    const opts = {
      cwd: path.join(__dirname, 'fixtures')
    };

    expect(runLoader('test.json', opts)).to.be.an('object');
  });

  it('allows file parsing to be restricted to JSON', () => {
    const opts = {
      format: 'json'
    };

    expect(runLoader('fixtures/test.yml', opts)).to.be.an.instanceOf(Error);
  });

  it('allows file parsing to be restricted to YML', () => {
    const opts = {
      format: 'yml'
    };

    expect(runLoader('fixtures/.failrc', opts)).to.be.an.instanceOf(Error);
  });
});
