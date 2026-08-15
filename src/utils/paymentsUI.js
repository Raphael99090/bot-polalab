const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { buildPagamentoOverviewEmbed } = require('./embeds');

function buildPagamentoReply(paymentsConfig) {
  const embed = buildPagamentoOverviewEmbed(paymentsConfig);

  const select = new StringSelectMenuBuilder()
    .setCustomId('pagamento_metodo')
    .setPlaceholder('Escolha a forma de pagamento')
    .addOptions(paymentsConfig.metodos.map(m => ({ label: m.nome, value: m.id })));

  const row = new ActionRowBuilder().addComponents(select);

  return { embeds: [embed], components: [row] };
}

module.exports = { buildPagamentoReply };