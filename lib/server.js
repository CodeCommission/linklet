const serve = require('./handler');
const listen = require('./listen');
const load = require('./load');

module.exports = async (file, opts, fn = load(file)) => {
  const server = await listen(serve(fn), opts);

  process.on('SIGINT', () => {
    server.close();
    process.exit(0);
  });
};
