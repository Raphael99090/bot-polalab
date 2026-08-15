const { carregarConfig } = require('./configLoader');

function carregarFaq() {
  return carregarConfig('faq.json');
}

module.exports = { carregarFaq };