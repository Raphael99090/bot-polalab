const { SlashCommandBuilder } = require('discord.js');
const { carregarMessages } = require('../utils/messagesLoader');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('atendimento')
    .setDescription('Chame a equipe do PolaLab para te ajudar'),

  async execute(interaction) {
    const messages = carregarMessages();
    const staffRoleId = process.env.STAFF_ROLE_ID;
    const mencaoStaff = staffRoleId ? `<@&${staffRoleId}>` : 'a equipe';

    const texto = messages.atendimento.template
      .replace('{usuario}', interaction.user)
      .replace('{staff}', mencaoStaff);

    await interaction.reply({ content: texto });
  }
};