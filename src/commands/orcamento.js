const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { carregarServices } = require('../utils/servicesLoader');
const { criarSessao } = require('../utils/orcamentoSession');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('orcamento')
    .setDescription('Monte um orçamento para um dos nossos serviços'),

  async execute(interaction) {
    const servicesConfig = carregarServices();
    criarSessao(interaction.user.id);

    const select = new StringSelectMenuBuilder()
      .setCustomId('orcamento_categoria')
      .setPlaceholder('Escolha uma categoria')
      .addOptions(
        servicesConfig.categorias.map(c => ({
          label: c.nome,
          value: c.id,
          description: c.descricao.slice(0, 90)
        }))
      );

    const row = new ActionRowBuilder().addComponents(select);

    await interaction.reply({
      content: '**Vamos montar seu orçamento!**\nEscolha a categoria do serviço:',
      components: [row],
      ephemeral: true
    });
  }
};