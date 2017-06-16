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

## How to use it in my project?

Being stable and inventive and have a look to our [Linklet examples](https://github.com/codecommission/linklet-examples).

## Contributors

Every participation is welcome. Check them out [here](https://github.com/codecommission/linklet/graphs/contributors).

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public [GitHub issue tracker](https://github.com/codecommission/linklet/issues).

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.

## Thanks

You like this and you want to see what coming next? Follow me on Twitter [`@mikebild`](https://twitter.com/mikebild).

Enjoy!