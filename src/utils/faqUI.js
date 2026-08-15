const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { buildFaqOverviewEmbed } = require('./embeds');

function buildFaqReply(faqConfig) {
  const embed = buildFaqOverviewEmbed(faqConfig);

  const select = new StringSelectMenuBuilder()
    .setCustomId('faq_pergunta')
    .setPlaceholder('Escolha uma pergunta')
    .addOptions(faqConfig.perguntas.map(p => ({ label: p.pergunta.slice(0, 100), value: p.id })));

  const row = new ActionRowBuilder().addComponents(select);

  return { embeds: [embed], components: [row] };
}

module.exports = { buildFaqReply };