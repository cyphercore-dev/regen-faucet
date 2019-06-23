const regen = require('./regen');
const config = require('./config');

class Faucet {
  constructor(
    mnemonic,
    chainId,
    gasLimit,
    txDenom,
    txAmount,
    feeAmount
  ) {
    this.account = regen.crypto.recover(mnemonic, 'english');
    this.options = {
      chainId,
      gasLimit,
      txDenom,
      txAmount,
      feeAmount,
    };
  }
}

const faucet = new Faucet(
  config.mnemonic,
  config.chainId,
  config.gasLimit,
  config.txDenom,
  config.txAmount,
  config.feeAmount
)

module.exports = faucet;
