const NODE_ENV = process.env.NODE_ENV || 'development';
const { write } = require('clipboardy');
const boxen = require('boxen');
const getPort = require('get-port');
const ip = require('ip');
const chalk = require('chalk');

module.exports = (http, {silent = false, port = 0, host = '0.0.0.0'} = {}) => {
  port = parseInt(port);
  host = host === '0.0.0.0' ? null : host;

  return new Promise(async (resolve, reject) => {
    http.on('error', reject);
    const freePort = await getPort(port);
    const server = http.listen(freePort, host, async () => {
      const settings = await greetings(server, {silent, port, host, freePort});
      resolve(Object.assign(server, settings));
    });

  });
};

async function greetings (server, {silent, port, host, freePort}) {
  const serverAddress = server.address();
  const ipAddr = ip.address();
  const portAddr = serverAddress.port;
  const networkURL = `http://${ipAddr}:${portAddr}`;
  const localURL = `http://localhost:${portAddr}`;

  return new Promise(async resolve => {
    if (!silent) {
      let message = chalk.green(`Listening (${NODE_ENV})`);

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

    resolve({
      networkURL,
      localURL,
      ip: ipAddr,
      port: portAddr,
      url: localURL,
    });
  });
}

async function toClipboard (txt) {
  try {
    await write(txt);
    return true;
  } catch (e) {
    return false;
  }
}