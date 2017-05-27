const {interval} = require('linklet');

module.exports = interval({period: 1000})(() => {
  console.log('Hello World!')
});

