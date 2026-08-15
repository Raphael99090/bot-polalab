const { carregarConfig } = require('./configLoader');

function carregarMessages() {
  return carregarConfig('messages.json');
}

module.exports = { carregarMessages };