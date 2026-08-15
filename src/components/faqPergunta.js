const { carregarFaq } = require('../utils/faqLoader');
const { buildFaqRespostaEmbed } = require('../utils/embeds');

module.exports = {
  customId: 'faq_pergunta',
  async execute(interaction) {
    const faqConfig = carregarFaq();
    const perguntaId = interaction.values[0];
    const pergunta = faqConfig.perguntas.find(p => p.id === perguntaId);

    if (!pergunta) {
      await interaction.update({ content: 'Pergunta não encontrada.', embeds: [], components: [] });
      return;
    }

    const embed = buildFaqRespostaEmbed(pergunta);
    await interaction.update({ content: '', embeds: [embed], components: [] });
  }
};