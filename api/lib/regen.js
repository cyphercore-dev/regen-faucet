const ClientApp = require('./app.js');
const Faucet = require('./faucet.js');

const regenApp = new ClientApp( '/home/jim380/go_workspace/bin/xrncli',
                                [
                                  '--home=/home/jim380/.xrncli',
                                  '-y'
                                ]);

const regenService = { 
  faucet: new Faucet ( 'xrn:1thq0u7qeltna23emadkqv9cz0qmcjj5299ne06',
                                 '01234567',
                                 'regen-test-1001',
                                 regenApp
                                )
}

module.exports = regenService;
