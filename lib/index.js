if (!require('is-async-supported')())
  require('async-to-gen/register')({excludes: null});

const handler = require('./handler');
const server = require('./server');
const listen = require('./listen');

module.exports = Object.assign(handler, {server, listen});
