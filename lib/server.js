const serve = require('./handler');
const listen = require('./listen');
const load = require('./load');

module.exports = (file, opts, fn = load(file)) => listen(serve(fn), opts);
