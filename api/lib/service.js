const faucet = require('./faucet.js');
const builder = require('./regen').builder;
const httpClient = require('./http-client');

function handleFaucetRequest(recipient) {
  return new Promise(function(resolve) {
    httpClient.initiateTransaction(faucet, recipient)
      .then(tx => {
        try {
          httpClient.broadcastTransaction(
            builder
              .buildAndSignTx(
                tx, 
                faucet.account.privateKey
              ).GetData()
          )
          .then(res => resolve(res.data));  
        } catch (error) {
          console.log(error.message);
          resolve({ error: error.message });
        }
      });
  });
}

module.exports = {
  handleFaucetRequest
};
