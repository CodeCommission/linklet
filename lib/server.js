const serve = require('./handler');
const listen = require('./listen');
const load = require('./load');

module.exports = async (file, options, fn = load(file)) => {
  fn.onStart = fn.onStart || (() => ({}));
  fn.onStop = fn.onStop || (() => ({}));

  await fn.onStart(options);
  const server = await listen(serve(fn), options);
  const onStop = async () => {
    const exitCode = await fn.onStop();
    server.close(() => {
      process.exit(exitCode);
    });
  };
  process.on('SIGTERM', onStop);
  process.on('SIGINT', onStop);

  return server;
};
