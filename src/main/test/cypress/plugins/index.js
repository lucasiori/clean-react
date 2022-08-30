const cypressTypeScriptPreprocessos = require('./cy-ts-preprocessor')

module.exports = on => {
  on('file:preprocessor', cypressTypeScriptPreprocessos)
}
