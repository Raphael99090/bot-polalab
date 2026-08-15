const { carregarConfig } = require('./configLoader');

function carregarServices() {
  return carregarConfig('services.json');
}

module.exports = { carregarServices };