const fs = require('node:fs');
const path = require('node:path');

const configDir = path.join(__dirname, '..', 'config');

function carregarConfig(nomeArquivo) {
  const caminho = path.join(configDir, nomeArquivo);
  if (!fs.existsSync(caminho)) {
    throw new Error(`Arquivo de configuração não encontrado: src/config/${nomeArquivo}`);
  }
  return JSON.parse(fs.readFileSync(caminho, 'utf-8'));
}

module.exports = { carregarConfig };