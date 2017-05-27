const { write } = require('clipboardy');
const boxen = require('boxen');
const getPort = require('get-port');
const ip = require('ip');
const chalk = require('chalk');

module.exports = async (http, {silent, port, host}) => {
  port = parseInt(port);
  host = host === '0.0.0.0' ? null : host;

  const freePort = await getPort(port);
  const server = http.listen(freePort, host, async () => greetings(server, {silent, port, host, freePort}));

  server.on('error', err => {
    console.error(err.stack);
    process.exit(1);
  });

  return server;
};

async function greetings (server, {silent, port, host, freePort}) {
  if (silent) return;

  const serverAddress = server.address();
  const ipAddress = ip.address();
  const networkURL = `http://${ipAddress}:${serverAddress.port}`;
  const localURL = `http://localhost:${serverAddress.port}`;
  let message = chalk.green('Linklet is listing.');

  if (port !== freePort) message += ' ' + chalk.red(`(Port ${port} is already in use, listen on ${freePort})`);
  message += '\n\n';
  message += `• ${chalk.bold('Local:   ')} ${localURL}\n`;
  message += `• ${chalk.bold('Network: ')} ${networkURL}\n\n`;

  if (process.stdout.isTTY) {
    const copied = await toClipboard(localURL);
    if (copied) message += `${chalk.grey('Local address copied to clipboard.')}`;
  }

  console.log(boxen(message, {padding: 1, borderColor: 'gray', margin: 1}));
}

async function toClipboard (txt) {
  try {
    await write(txt);
    return true;
  } catch (e) {
    return false;
  }
}