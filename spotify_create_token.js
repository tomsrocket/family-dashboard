
const express = require('express');
const axios = require('axios');
const querystring = require('querystring'); 

const config = require('./config.json');
var client_id = config.spotify.client_id;
var client_secret = config.spotify.client_secret;
var redirect_uri = 'http://127.0.0.1:8888/callback';
 
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

var app = express();

app.get('/', function(req, res) {

  var state = generateRandomString(16);
  var scope = 'user-read-currently-playing user-read-recently-played user-follow-read user-read-playback-state user-top-read user-library-read playlist-read-private playlist-read-collaborative';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});


app.get('/callback', async function(req, res) {
  const code = req.query.code;

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri
      }),
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    res.json(response.data); // enthält access_token + refresh_token

  } catch (err) {
    res.send(err.response?.data || err.message);
  }
});


app.get('/callback2', function(req, res) {
    res.send(JSON.stringify(req.query, null, 2));
});


app.listen(8888, () => {
  console.log('Server läuft auf http://localhost:8888');
});