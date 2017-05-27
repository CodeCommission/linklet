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