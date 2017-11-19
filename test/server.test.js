const assert = require('assert');
const fetch = require('node-fetch');

const linklet = require('../lib');
const sut = linklet((req, res) => ({message: 'Hello World from Linklet!'}));

describe('Linklet as module tests', () => {
  let instance = null;

  before(() => (instance = sut.listen()));
  after(() => instance.close());

  it('Should respone with status code 200', () => {
    return fetch(
      `http://localhost:${instance.address().port}`
    ).then(response => {
      assert.equal(response.status, 200);
    });
  });

  it('Should respone JSON with default object', () => {
    return fetch(`http://localhost:${instance.address().port}`)
      .then(response => response.json())
      .then(data => {
        assert.deepEqual(data, {message: 'Hello World from Linklet!'});
      });
  });
});
