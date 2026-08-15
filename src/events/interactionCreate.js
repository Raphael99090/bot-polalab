const { carregarMessages } = require('../utils/messagesLoader');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error('Erro no comando:', error);
        await respostaDeErro(interaction, 'comando');
      }
      return;
    }

    if (interaction.isStringSelectMenu() || interaction.isButton()) {
      const component = client.components.get(interaction.customId);
      if (!component) return;

      try {
        await component.execute(interaction);
      } catch (error) {
        console.error('Erro no componente:', error);
        await respostaDeErro(interaction, 'componente');
      }
      return;
    }
  }
};

async function respostaDeErro(interaction, tipo) {
  const messages = carregarMessages();
  const payload = { content: messages.erros[tipo], ephemeral: true };
  try {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(payload);
    } else {
      await interaction.reply(payload);
    }
  } catch (err) {
    console.error('Falha ao enviar resposta de erro:', err);
  }
}