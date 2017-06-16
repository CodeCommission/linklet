# Linklet

> Async lambda functions as HTTP microservices.

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
cd my-first-function
npm run dev
```

## How to use it in my project?

Look at [linklet examples](https://github.com/CodeCommission/linklet-examples).

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