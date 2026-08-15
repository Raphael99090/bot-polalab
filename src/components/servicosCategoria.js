const { carregarServices } = require('../utils/servicesLoader');
const { buildCategoriaDetailEmbed } = require('../utils/embeds');

module.exports = {
  customId: 'servicos_categoria',

  async execute(interaction) {
    const servicesConfig = carregarServices();
    const categoriaId = interaction.values[0];
    const categoria = servicesConfig.categorias.find(c => c.id === categoriaId);

    if (!categoria) {
      await interaction.reply({ content: 'Categoria não encontrada.', ephemeral: true });
      return;
    }

    const embed = buildCategoriaDetailEmbed(categoria);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};