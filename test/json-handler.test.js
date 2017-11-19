const assert = require('assert');
const fetch = require('node-fetch');

const linklet = require('../lib');
const {compose, withQuery, withTime, withJsonBody} = require('../lib');

const sut = linklet(
  compose(
    withTime({suffix: true}),
    withQuery(),
    withJsonBody()
  )((req, res) => ({
    body: req.body,
    query: req.query
  }))
);

describe('Linklet compose withJsonBody() tests', () => {
  let instance = null;

  before(() => (instance = sut.listen()));
  after(() => instance.close());

  it('Should handle JSON body', () => {
    return fetch(`http://localhost:${instance.address().port}`, {
      method: 'POST',
      body: JSON.stringify({hello: 'world'})
    })
      .then(response => response.json())
      .then(actual => {
        assert.deepEqual(actual, {body: {hello: 'world'}, query: {}});
      });
  });

  it('Should handle request query withQuery()', () => {
    return fetch(`http://localhost:${instance.address().port}?foo=bar&demo=yes`)
      .then(response => response.json())
      .then(actual => {
        assert.deepEqual(actual, {query: {foo: 'bar', demo: 'yes'}});
      });
  });
});
