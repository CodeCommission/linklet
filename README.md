# Linklet

> HTTP microservice made fast and easy with ES6 async lambda functions.

## Setup & Run

Firstly, install it:

```bash
npm i -g linklet
```

Create your first ES6 async lambda function:

```bash
linklet create my-first-function
```

Serve locally:

```bash
linklet serve my-first-function
```

## Compose to higher handler

```javascript
const {compose, cors, query, time, log, send} = require('linklet');

module.exports = compose(
  time({suffix: true}),
  cors({}),
  log({json: true}),
  query()
)(handler);

async function handler (req, res) {
  send({
    message: 'foo',
    query: req.query,
  });
}
```

## Self-Hosting usage as module

```javascript
const linklet = require('linklet');

const http = linklet((req, res) => res.end('Hello World'));

const server = http.listen(5000, () => console.log(`Listen on ${server.address().port}`));
```

## Extend with compose functions

### Create extention

```javascript
module.exports.myFooModule = options => handler => (req, res) => {
   // do something ...
  return handler(req, res);
};
```

### Extention usage

```javascript
module.exports = compose(
  log({json: true}),
  myFooModule({suffix: true}),
)(handler);

async function handler (req, res) {
  send({
    message: 'foo',
    query: req.query,
  });
}
```