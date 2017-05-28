const {interval} = require('../lib');

module.exports = interval({period: 1000})(() => {
  console.log('Hello World!')
});

