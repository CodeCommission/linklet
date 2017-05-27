const linklet = require('linklet');

const http = linklet((req, res) => res.end('Hello World'));

const server = http.listen(5000, () => console.log(`Listen on ${server.address().port}`));