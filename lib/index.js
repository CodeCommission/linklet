const chalk = require('chalk');
const serve = require('./handler');
const listen = require('./listen');
const load = require('./load');

module.exports = async (file, opts, fn = load(file)) => {
  const server = await listen(serve(fn), opts);

  process.on('SIGINT', () => {
    console.log(chalk.gray(` Process interrupted - Exit(0)`));
    server.close();
    process.exit(0);
  });
};
