const { SlashCommandBuilder } = require('discord.js');
const { carregarMessages } = require('../utils/messagesLoader');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Testa se o bot está respondendo'),

  async execute(interaction) {
    const messages = carregarMessages();
    await interaction.reply(messages.ping.pong);
  }
};