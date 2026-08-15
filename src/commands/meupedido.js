const { SlashCommandBuilder } = require('discord.js');
const { buscarPedidosPorUsuario } = require('../database/pedidos');
const { buildPedidosEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meupedido')
    .setDescription('Consulte seus pedidos no PolaLab'),

  async execute(interaction) {
    const pedidos = buscarPedidosPorUsuario(interaction.user.id);

    if (pedidos.length === 0) {
      await interaction.reply({ content: 'Você ainda não tem nenhum pedido. Use /orcamento pra começar um!', ephemeral: true });
      return;
    }

    const embed = buildPedidosEmbed(pedidos);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};