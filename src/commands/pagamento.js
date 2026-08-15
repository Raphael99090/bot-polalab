const { SlashCommandBuilder } = require('discord.js');
const { carregarPayments } = require('../utils/paymentsLoader');
const { buildPagamentoReply } = require('../utils/paymentsUI');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pagamento')
    .setDescription('Veja as formas de pagamento disponíveis'),

  async execute(interaction) {
    const paymentsConfig = carregarPayments();
    const payload = buildPagamentoReply(paymentsConfig);
    await interaction.reply({ ...payload, ephemeral: true });
  }
};