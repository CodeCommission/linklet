const assert = require('assert');
const fetch = require('node-fetch');

const linklet = require('../lib');
const {compose, withQuery, withTime, withParams} = require('../lib');

const sut = linklet(
  compose(
    withTime({suffix: true}),
    withParams({path: '/items/:id'}),
    withQuery()
  )((req, res) => ({
    params: req.params,
    hasParamMatch: req.hasParamMatch
  }))
);

describe('Linklet compose withParams() tests', () => {
  let instance = null;

  before(() => (instance = sut.listen()));
  after(() => instance.close());

  it('Should handle route parameter /items/:id', () => {
    return fetch(`http://localhost:${instance.address().port}/items/1`)
      .then(response => response.json())
      .then(actual => {
        assert.deepEqual(actual, {params: {id: 1}, hasParamMatch: true});
      });
  });
});
