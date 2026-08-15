const { limparSessao } = require('../utils/orcamentoSession');
const { carregarMessages } = require('../utils/messagesLoader');

module.exports = {
  customId: 'orcamento_cancelar',
  async execute(interaction) {
    limparSessao(interaction.user.id);
    const messages = carregarMessages();
    await interaction.update({ content: messages.orcamento.cancelado, embeds: [], components: [] });
  }
};