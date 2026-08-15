const { PermissionsBitField, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { carregarServices } = require('../utils/servicesLoader');
const { carregarMessages } = require('../utils/messagesLoader');
const { obterSessao, limparSessao } = require('../utils/orcamentoSession');
const { calcularOrcamento } = require('../utils/precoCalculator');
const { criarPedido, atualizarCanalPedido } = require('../database/pedidos');

module.exports = {
  customId: 'orcamento_confirmar',
  async execute(interaction) {
    const messages = carregarMessages();
    const sessao = obterSessao(interaction.user.id);

    if (!sessao || !sessao.categoriaId || !sessao.servicoId || !sessao.pacoteId) {
      await interaction.update({ content: messages.orcamento.sessaoExpirada, embeds: [], components: [] });
      return;
    }

    const servicesConfig = carregarServices();
    const categoria = servicesConfig.categorias.find(c => c.id === sessao.categoriaId);
    const servico = categoria.servicos.find(s => s.id === sessao.servicoId);
    const { pacote, extras, total } = calcularOrcamento(servico, sessao.pacoteId, sessao.extras || []);

    const pedidoId = criarPedido({
      userId: interaction.user.id,
      username: interaction.user.username,
      categoria: categoria.nome,
      servico: servico.nome,
      pacote: pacote.nome,
      extras: JSON.stringify(extras.map(e => e.nome)),
      total,
      prazo: servico.prazoEstimado,
      status: 'Aberto',
      canalId: null
    });

    limparSessao(interaction.user.id);

    const canal = await criarCanalDoPedido(interaction, pedidoId, categoria, servico, pacote, extras, total);
    atualizarCanalPedido(pedidoId, canal.id);

    await interaction.update({
      content: `✅ Pedido #${pedidoId} confirmado! Acompanhe por aqui: ${canal}`,
      embeds: interaction.message.embeds,
      components: []
    });
  }
};

async function criarCanalDoPedido(interaction, pedidoId, categoria, servico, pacote, extras, total) {
  const guild = interaction.guild;
  const categoryId = process.env.CATEGORY_ID;
  const staffRoleId = process.env.STAFF_ROLE_ID;

  const permissionOverwrites = [
    { id: guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
    {
      id: interaction.user.id,
      allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
    },
    {
      id: interaction.client.user.id,
      allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
    }
  ];

  if (staffRoleId) {
    permissionOverwrites.push({
      id: staffRoleId,
      allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
    });
  }

  const canal = await guild.channels.create({
    name: `pedido-${pedidoId}`,
    type: ChannelType.GuildText,
    parent: categoryId || undefined,
    permissionOverwrites
  });

  const embed = new EmbedBuilder()
    .setTitle(`🧾 Pedido #${pedidoId}`)
    .setColor(0x8A63D2)
    .addFields(
      { name: 'Cliente', value: `<@${interaction.user.id}>`, inline: true },
      { name: 'Status', value: 'Aberto', inline: true },
      { name: 'Categoria', value: categoria.nome, inline: true },
      { name: 'Serviço', value: servico.nome },
      { name: 'Pacote', value: `${pacote.nome} — R$ ${pacote.preco}` },
      { name: 'Extras', value: extras.length > 0 ? extras.map(e => `${e.nome} — R$ ${e.preco}`).join('\n') : 'Nenhum' },
      { name: 'Prazo estimado', value: servico.prazoEstimado },
      { name: 'Total', value: `**R$ ${total}**` }
    );

  const botaoPagamento = new ButtonBuilder()
    .setCustomId('ticket_pagamento')
    .setLabel('💳 Ver formas de pagamento')
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(botaoPagamento);

  await canal.send({ content: `<@${interaction.user.id}>`, embeds: [embed], components: [row] });

  return canal;
}