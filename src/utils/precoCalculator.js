function calcularOrcamento(servico, pacoteId, extrasIds) {
  const pacote = servico.pacotes.find(p => p.id === pacoteId);
  const extras = (servico.extras || []).filter(e => extrasIds.includes(e.id));
  const total = pacote.preco + extras.reduce((soma, e) => soma + e.preco, 0);
  return { pacote, extras, total };
}

module.exports = { calcularOrcamento };