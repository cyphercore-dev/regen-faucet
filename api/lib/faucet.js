const { spawn } = require('child_process');

class Faucet {
  constructor(
    account,
    password,
    chain,
    app
  ) {
    this.account = account;
    this.password = password;
    this.chain = chain;
    this.app = app;
  }

  handleTxRequest(recipient, amount) {
    let txRef = this.sendFaucetTx(recipient, amount);
    let passRef = this.injectFaucetPassword();

    return new Promise ( function(resolve) {
      txRef.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
        resolve({error: 'Server error!'});
      });

      passRef.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
        resolve({error: 'Server error!'});
      });

      passRef.stdout.pipe( txRef.stdin );

      txRef.stdout.on('data', (data) => {
        resolve(`${data}`);
      });
    });   
  }

  injectFaucetPassword() { return spawn('echo', [ this.password ]) }
 
  sendFaucetTx(recipient, amount) { 
    return spawn(  
                  this.app.path, 
                  [ 
                    'tx', 'send', 
                    this.account, 
                    recipient, 
                    amount,
                    `--chain-id=${this.chain}`,
                    ...this.app.options 
                  ]
                ); 

  }
}

module.exports = Faucet;
