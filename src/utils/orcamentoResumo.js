const { carregarServices } = require('./servicesLoader');
const { carregarMessages } = require('./messagesLoader');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { calcularOrcamento } = require('./precoCalculator');
const { buildResumoEmbed } = require('./embeds');
const { atualizarSessao } = require('./orcamentoSession');

async function mostrarResumo(interaction, categoriaId, servicoId, pacoteId, extrasIds) {
  const servicesConfig = carregarServices();
  const messages = carregarMessages();
  const categoria = servicesConfig.categorias.find(c => c.id === categoriaId);
  const servico = categoria?.servicos.find(s => s.id === servicoId);
  const pacoteExiste = servico?.pacotes.some(p => p.id === pacoteId);

  if (!categoria || !servico || !pacoteExiste) {
    await interaction.update({ content: messages.orcamento.sessaoExpirada, embeds: [], components: [] });
    return;
  }

  const { pacote, extras, total } = calcularOrcamento(servico, pacoteId, extrasIds);
  atualizarSessao(interaction.user.id, { extras: extrasIds, total });

  const embed = buildResumoEmbed(categoria, servico, pacote, extras, total);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('orcamento_confirmar').setLabel('Confirmar').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('orcamento_cancelar').setLabel('Cancelar').setStyle(ButtonStyle.Danger)
  );

  await interaction.update({ content: '', embeds: [embed], components: [row] });
}

module.exports = { mostrarResumo };