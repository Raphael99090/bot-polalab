const { carregarPayments } = require('../utils/paymentsLoader');
const { buildPagamentoInstrucoesEmbed } = require('../utils/embeds');

module.exports = {
  customId: 'pagamento_metodo',
  async execute(interaction) {
    const paymentsConfig = carregarPayments();
    const metodoId = interaction.values[0];
    const metodo = paymentsConfig.metodos.find(m => m.id === metodoId);

    if (!metodo) {
      await interaction.update({ content: 'Forma de pagamento não encontrada.', embeds: [], components: [] });
      return;
    }

    const embed = buildPagamentoInstrucoesEmbed(metodo);
    await interaction.update({ content: '', embeds: [embed], components: [] });
  }
};