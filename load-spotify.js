const fs = require('fs');
const axios = require('axios');

const config = require('./config.json');
var client_id = config.spotify.client_id;
var client_secret = config.spotify.client_secret;
var refresh_token = config.spotify.refresh_token;

// wo dein Dashboard die Datei liest
const OUTPUT_FILE = 'public/data/spotify.json';
const OUTPUT_FILE_RAW = 'public/data/spotify_raw.json';

async function run() {
  try {
    // 1. neues Access Token holen
    const tokenRes = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      }),
      {
        headers: {
          'Authorization':
            'Basic ' +
            Buffer.from(client_id + ':' + client_secret).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const access_token = tokenRes.data.access_token;

    // 2. Recently Played abrufen
    const recentRes = await axios.get(
      'https://api.spotify.com/v1/me/player/recently-played?limit=20',
      {
        headers: {
          'Authorization': 'Bearer ' + access_token
        }
      }
    );

    // 3. JSON speichern
    fs.writeFileSync(
      OUTPUT_FILE_RAW,
      JSON.stringify(recentRes.data, null, 2)
    );

    const simplified = recentRes.data.items.map(item => ({
      song: item.track.name,
      artist: item.track.artists.map(a => a.name).join(', '),
      cover: item.track.album.images[0]?.url,
      played_at: item.played_at
    }));

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(simplified, null, 2));

    console.log('Spotify-Daten aktualisiert:', new Date());

  } catch (err) {
    console.error('Fehler:', err.response?.data || err.message);
  }
}

run();