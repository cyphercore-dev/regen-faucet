const http = require('http');
const https = require('https');
const axios = require('axios');
const config = require('./config');

const MAX_CONCURRENT = 5;
const baseURL = config.url;

const httpAgent = new http.Agent({ keepAlive: true, maxSockets: MAX_CONCURRENT });
const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: MAX_CONCURRENT });

const httpClient = axios.create({ 
  httpAgent, 
  httpsAgent,
  baseURL 
});


function handleError(error) {
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    console.log(error.request);
  } else {
    console.log('Error', error.message);
  }
  console.log(error.config);
}

function getAccount(address) {
  return httpClient.get(`/auth/accounts/${address}`)
          .then(res => res.data)
          .catch(function (error) {
            handleError(error);
          });
}

function broadcastTransaction(stdTx) {
  return httpClient
        .post('/txs',{ tx: stdTx.tx, mode: stdTx.mode })
        .then( (tx) => { 
          return tx; 
        })
        .catch(function (error) {
          handleError(error);
        });
}

function getSignReqs(address) {
  return getAccount(address)
          .then( (account) => { 
            return {
              sequence: account.value.sequence, 
              number: account.value.account_number 
            } 
          });
}

function initiateTransaction(faucet, recipient) {
  return getSignReqs(faucet.account.address)
          .then( (reqs) => {
              return {
                chain_id: faucet.options.chainId,
                from: faucet.account.address,
                account_number: reqs.number,
                sequence: reqs.sequence,
                fees: {
                  denom: faucet.options.txDenom,
                  amount: faucet.options.feeAmount
                },
                gas: faucet.options.gasLimit,
                memo: "Sent by Cypher Core Regen Faucet",
                type: require('./regen').irisnet.config.regen.tx.transfer.type,
                msg: {
                  to: recipient,
                  coins: [
                    {
                      denom: faucet.options.txDenom,
                      amount: faucet.options.txAmount
                    }
                  ]
                }
            };
          })    
}




function getTransactions(query, limit, page) {
  return httpClient.get(`/txs?${query}&limit=${limit}&page=${page}`)
          .then(res => res.data)
          .catch(function (error) {
            handleError(error);
          });
}

function getSentTransactions(address, limit, page) {
  return getTransactions(`sender=${address}`, limit, page)
          .then( data => data.txs );
}

function getRecievedTransactions(address, limit, page) {
  return getTransactions(`recipient=${address}`, limit, page)
          .then( data => data.txs );
}



module.exports = {
  httpClient,
  getAccount,
  getSignReqs,
  broadcastTransaction,
  getTransactions,
  getSentTransactions,
  getRecievedTransactions,
  initiateTransaction
};