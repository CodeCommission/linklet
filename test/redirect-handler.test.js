const assert = require('assert');
const fetch = require('node-fetch');

const linklet = require('../lib');
const {compose, withRedirect} = require('../lib');

const sut = linklet(
  compose(withRedirect({path: '/', target: '/test'}))((req, res) => ({
    body: req.body,
    query: req.query
  }))
);

describe('Linklet compose withRedirect() tests', () => {
  let instance = null;

  before(async () => await (instance = sut.listen()));
  after(async () => await instance.close());

  it('Should redirect route / to target /test', async () => {
    const response = await fetch(
      `http://localhost:${instance.address().port}`,
      {
        redirect: 'manual'
      }
    );
    const actual = response.headers.get('location');
    assert.equal(actual, `http://localhost:${instance.address().port}/test`);
  });
});
