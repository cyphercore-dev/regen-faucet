const express = require('express');
const faucetService = require('./lib/service.js');

const app = express();
app.use(express.json());

const port = 3000;
const getStatus = () => `Faucet server is running on port ${port}!`;

app.get('/faucet/status', (req, res) => res.json( { status: `${getStatus()}` } ));

app.post('/faucet/request', function (req, res) {
  if(req.body.recipient) {
    faucetService.handleFaucetRequest(req.body.recipient)
      .then((tx) => {
        if(!tx.error) {
          res.json({ status: "success", hash: tx.hash });
        } else {
          res.json({ status: tx.error });
        }
      })
      .catch(err => res.json({ status: 'Error while parsing Address!' }))
  } else {
    res.json( { status: 'Request error!' } );
  }
});


app.listen(port, () => console.log(getStatus()));
