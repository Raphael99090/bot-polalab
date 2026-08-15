const sessoes = new Map();

function criarSessao(userId) {
  sessoes.set(userId, { categoriaId: null, servicoId: null, pacoteId: null, extras: [] });
}

function obterSessao(userId) {
  return sessoes.get(userId);
}

function atualizarSessao(userId, dados) {
  const atual = sessoes.get(userId) || {};
  sessoes.set(userId, { ...atual, ...dados });
}

function limparSessao(userId) {
  sessoes.delete(userId);
}

module.exports = { criarSessao, obterSessao, atualizarSessao, limparSessao };