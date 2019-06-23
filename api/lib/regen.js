const irisnet = require('irisnet-crypto');
const crypto = irisnet.getCrypto('regen');
const builder = irisnet.getBuilder('regen');

module.exports = {
  irisnet,
  crypto,
  builder
};

