const assert = require('assert');
const fetch = require('node-fetch');

const linklet = require('../lib');
const {compose, withRedirect} = require('../lib');

describe('Linklet handler tests', () => {
  it('Should response with status code 200 by default', async () => {
    const server = await linklet((req, res) => {
      return {};
    }).listen();
    const response = await fetch(`http://localhost:${server.address().port}`);

    assert.equal(response.status, 200);
    server.close();
  });

  it('Should response with status code 404 by missing handler', async () => {
    const server = await linklet().listen();
    const response = await fetch(
      `http://localhost:${server.address().port}/noroute`
    );

    assert.equal(response.status, 404);
    server.close();
  });

  it('Should response with status code 500 on error', async () => {
    const server = await linklet((req, res) => {
      throw new Error('An error!');
    }).listen();

    const response = await fetch(`http://localhost:${server.address().port}`);

    assert.equal(response.status, 500);
    server.close();
  });

  it('Should response with status code 204 by null', async () => {
    const server = await linklet((req, res) => {
      return null;
    }).listen();
    const response = await fetch(`http://localhost:${server.address().port}`);

    assert.equal(response.status, 204);
    server.close();
  });

  it('Should response with status code 204 by undefined', async () => {
    const server = await linklet((req, res) => {}).listen();
    const response = await fetch(`http://localhost:${server.address().port}`);

    assert.equal(response.status, 204);
    server.close();
  });

  it('Should response with status code 201 by setting status code', async () => {
    const server = await linklet((req, res) => {
      res.statusCode = 201;
      return {};
    }).listen();
    const response = await fetch(`http://localhost:${server.address().port}`);

    assert.equal(response.status, 201);
    server.close();
  });
});
