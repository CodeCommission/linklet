# Compose HTTP Request/Response Handler

* [Compose handler functions](#compose-handler-functions)
* [Create reusable custom handler functions](#create-reusable-custom-handler-functions)

## Compose handler functions

```javascript
const {
  compose,
  withCORS,
  withQuery,
  withTime,
  withLog
} = require('linklet');

module.exports = compose(
  withTime({ suffix: true }),
  withCORS(),
  withLog({ json: true }),
  withQuery()
)(handler);

async function handler(req) {
  return {
    message: 'foo',
    query: req.query
  };
}
```

## Create reusable custom handler functions

Create **my-module.js**

```javascript
module.exports = ({} = {}) => handler => (req, res) => {
   // do something ...
  return handler(req, res);
};
```

### Extention usage

```javascript
const { compose, withLog } = require('linklet');
const myModule = require('./my-module');

module.exports = compose(
  withLog({json: true}),
  myModule({}),
)(handler);

async function handler (req, res) {
  return ({
    message: 'something ...',
    query: req.query,
  });
}
```
