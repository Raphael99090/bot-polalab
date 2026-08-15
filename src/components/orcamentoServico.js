const { carregarServices } = require('../utils/servicesLoader');
const { obterSessao, atualizarSessao } = require('../utils/orcamentoSession');
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  customId: 'orcamento_servico',
  async execute(interaction) {
    const servicesConfig = carregarServices();
    const sessao = obterSessao(interaction.user.id);
    const categoria = servicesConfig.categorias.find(c => c.id === sessao.categoriaId);
    const servicoId = interaction.values[0];
    const servico = categoria.servicos.find(s => s.id === servicoId);

    atualizarSessao(interaction.user.id, { servicoId, pacoteId: null, extras: [] });

    const select = new StringSelectMenuBuilder()
      .setCustomId('orcamento_pacote')
      .setPlaceholder('Escolha o pacote')
      .addOptions(
        servico.pacotes.map(p => ({
          label: `${p.nome} — R$ ${p.preco}`,
          value: p.id,
          description: p.descricao.slice(0, 90)
        }))
      );

    const row = new ActionRowBuilder().addComponents(select);
    await interaction.update({ content: `**Serviço:** ${servico.nome}\nEscolha o pacote:`, components: [row] });
  }
};