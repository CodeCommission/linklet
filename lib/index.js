if (!require('is-async-supported')()) require('async-to-gen/register')({excludes: null});
module.exports = Object.assign(require('./serve'), require('./handler'));