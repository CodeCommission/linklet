# HTTP Request/Response Handler functions

* [Handle JSON-Responses](#handle-json-Responses)
* [Handle JSON-Requests](#handle-json-requests)
* [Implement a periodic scheduled function](#implement-a-periodic-scheduled-function)
* [Handle URL-Encoded-Requests](#handle-url-encoded-requests)
* [Implement a external HTTP/JSON API call](#implement-a-external-http/json-api-call)
* [Implement a GraphQL API call](#implement-a-graphql-api-call)

## Handle JSON-Responses

Edit **index.js**:

```javascript
module.exports = async () => {
  return {
    msg: 'Hello World from Linklet!',
  }
}
```

## Handle JSON-Requests

Edit **index.js**:

```javascript
const {json} = require('linklet')

module.exports = async (req, res) => {
  const data = await json(req)
  console.log(data)
  return 'JSON body logged out to console!'
}
```

## Implement a periodic scheduled function

Edit **index.js**:

```javascript
const {interval} = require('linklet')
let count = 0
console.log(`Executes a function every 5s. Wait ...`)
module.exports = interval({period: 5000})(() => console.log(`${++count}x executed!`))
```

## Handle URL-Encoded-Requests

Install **NPM** dependencies:

```bash
npm install urlencoded-body-parser --save
```

Edit **index.js**:

```javascript
const parse = require('urlencoded-body-parser')

module.exports = async (req, res) => {
  const data = await parse(req)
  console.log(data)
  return 'URL encoded body logged to console!'
}
```

## Implement a external HTTP/JSON API call

Install **NPM** dependencies:

```bash
npm install node-fetch --save
```

Edit **index.js**:

```javascript
const fetch = require('node-fetch')

module.exports = async (req, res) => {
  const response = await fetch('https://api.npms.io/v2/search?q=linklet')
  const json = await response.json()

  return json.results
}
```

## Implement a GraphQL API call

Install **NPM** dependencies:

```bash
npm install apollo-client --save
npm install graphql-tag --save
npm install node-fetch --save
```

Edit **index.js**:

```javascript
global.fetch = require('node-fetch');
const {ApolloClient, createNetworkInterface} = require('apollo-client');
const gql = require('graphql-tag');

const networkInterface = createNetworkInterface({ uri: 'https://subkit-todos-api.cloud.dropstack.run/graphql' });
const client = new ApolloClient({networkInterface});
const query = gql`query loadAllTodos {
  todos {
    id
    rev
    text
    complete
  }
}`;

module.exports = async () => {
  const result = await client.query({query});
  return result.data
};
```