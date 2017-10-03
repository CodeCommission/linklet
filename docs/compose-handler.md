# Compose HTTP Request/Response Handler

* [Compose handler functions](#compose-handler-functions)
* [Create reusable custom handler functions](#create-reusable-custom-handler-functions)

## Compose handler functions

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

## Create reusable custom handler functions

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