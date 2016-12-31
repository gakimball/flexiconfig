'use strict';

const expect = require('chai').expect;
const getConfig = require('.');
const path = require('path');
const runLoader = require('./lib/runLoader');

describe('getConfig()', () => {
  it('returns the first match in a sequence', () => {
    expect(getConfig([{}, { kittens: true }, {}])).to.eql({ kittens: true });
  });

  it('throws an error if no match is found', () => {
    expect(() => getConfig([{}])).to.throw(Error);
  });

  it('travels up directories to find a match', () => {
    const opts = {
      cwd: path.join(__dirname, 'fixtures/sub')
    };

    expect(getConfig(['test.json'], opts)).to.be.an('object');
  });

  it('allows directory traveling to be disabled', () => {
    const opts = {
      cwd: path.join(__dirname, 'fixtures/sub'),
      travel: false
    };

    expect(() => getConfig(['test.json'], opts)).to.throw(Error);
  });
});

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

  it('skips a file that is not found', () => {
    expect(runLoader('fixtures/nope.json')).to.be.false;
  });

  it('fails a file that is not valid JSON or YML', () => {
    expect(runLoader('fixtures/.failrc')).to.be.an.instanceOf(Error);
  });

  it('passes a key within package.json', () => {
    expect(runLoader('package.json#test')).to.be.an('object');
  });

  it('skips a package.json missing the needed key', () => {
    expect(runLoader('package.json#nope')).to.be.false;
  });

  it('fails a package.json with a non-object key', () => {
    expect(runLoader('package.json#name')).to.be.an.instanceOf(Error);
  });

  it('allows a specific CWD to be set', () => {
    const opts = {
      cwd: path.join(__dirname, 'fixtures')
    };

    expect(runLoader('test.json', opts)).to.be.an('object');
  });
});
