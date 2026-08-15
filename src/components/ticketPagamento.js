const { carregarPayments } = require('../utils/paymentsLoader');
const { buildPagamentoReply } = require('../utils/paymentsUI');

module.exports = {
  customId: 'ticket_pagamento',
  async execute(interaction) {
    const paymentsConfig = carregarPayments();
    const payload = buildPagamentoReply(paymentsConfig);
    await interaction.reply({ ...payload, ephemeral: true });
  }
};