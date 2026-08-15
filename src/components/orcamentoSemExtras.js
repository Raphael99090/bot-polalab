const { obterSessao } = require('../utils/orcamentoSession');
const { mostrarResumo } = require('../utils/orcamentoResumo');

module.exports = {
  customId: 'orcamento_sem_extras',
  async execute(interaction) {
    const sessao = obterSessao(interaction.user.id);
    await mostrarResumo(interaction, sessao.categoriaId, sessao.servicoId, sessao.pacoteId, []);
  }
};