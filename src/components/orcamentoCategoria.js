const { carregarServices } = require('../utils/servicesLoader');
const { atualizarSessao } = require('../utils/orcamentoSession');
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  customId: 'orcamento_categoria',
  async execute(interaction) {
    const servicesConfig = carregarServices();
    const categoriaId = interaction.values[0];
    atualizarSessao(interaction.user.id, { categoriaId, servicoId: null, pacoteId: null, extras: [] });

    const categoria = servicesConfig.categorias.find(c => c.id === categoriaId);

    const select = new StringSelectMenuBuilder()
      .setCustomId('orcamento_servico')
      .setPlaceholder('Escolha o serviço')
      .addOptions(
        categoria.servicos.map(s => ({ label: s.nome, value: s.id, description: s.descricao.slice(0, 90) }))
      );

    const row = new ActionRowBuilder().addComponents(select);
    await interaction.update({ content: `**Categoria:** ${categoria.nome}\nEscolha o serviço:`, components: [row] });
  }
};