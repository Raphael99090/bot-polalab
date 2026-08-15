const { carregarServices } = require('../utils/servicesLoader');
const { obterSessao, atualizarSessao } = require('../utils/orcamentoSession');
const { mostrarResumo } = require('../utils/orcamentoResumo');
const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  customId: 'orcamento_pacote',
  async execute(interaction) {
    const servicesConfig = carregarServices();
    const sessao = obterSessao(interaction.user.id);
    const categoria = servicesConfig.categorias.find(c => c.id === sessao.categoriaId);
    const servico = categoria.servicos.find(s => s.id === sessao.servicoId);
    const pacoteId = interaction.values[0];

    atualizarSessao(interaction.user.id, { pacoteId, extras: [] });

    if (!servico.extras || servico.extras.length === 0) {
      await mostrarResumo(interaction, sessao.categoriaId, sessao.servicoId, pacoteId, []);
      return;
    }

    const select = new StringSelectMenuBuilder()
      .setCustomId('orcamento_extras')
      .setPlaceholder('Escolha os extras')
      .setMinValues(1)
      .setMaxValues(servico.extras.length)
      .addOptions(servico.extras.map(e => ({ label: `${e.nome} — R$ ${e.preco}`, value: e.id })));

    const selectRow = new ActionRowBuilder().addComponents(select);

    const skipButton = new ButtonBuilder()
      .setCustomId('orcamento_sem_extras')
      .setLabel('Seguir sem extras')
      .setStyle(ButtonStyle.Secondary);
    const buttonRow = new ActionRowBuilder().addComponents(skipButton);

    const pacote = servico.pacotes.find(p => p.id === pacoteId);
    await interaction.update({
      content: `**Pacote:** ${pacote.nome}\nEscolha os extras, ou clique em "Seguir sem extras":`,
      components: [selectRow, buttonRow]
    });
  }
};