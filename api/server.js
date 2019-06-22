const express = require('express');
const regenService = require('./lib/regen.js');

const app = express();
app.use(express.json());

const port = 3000;
const getStatus = () => `Faucet server is running on port ${port}!`;



app.get('/faucet/status', (req, res) => res.json( { status: `${getStatus()}` } ));

app.post('/faucet/request', function (req, res) {
  if(req.body.recipient) {
    regenService.faucet.handleTxRequest(req.body.recipient, '50tree')
    .then((tx) => tx.match(/\S{64}/g) )
    .then((hash)=> { 
      if(hash) {
        res.json({ status: "Success!", hash: hash[0] })
      } else {
        res.status(500).json({ status: "Error processing transaction!" })
      }
    })
    .catch(err => res.status(500).json({ status: 'Error while parsing Address!' }))
    //console.log(req.body);
  } else {
    res.status(500).json( { status: 'Request error!' } );
  }
});


app.listen(port, () => console.log(getStatus()));
