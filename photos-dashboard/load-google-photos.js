const fs = require("fs");
const { google } = require("googleapis");
const readline = require("readline");

const SCOPES = ["https://www.googleapis.com/auth/photoslibrary.readonly"];
const TOKEN_PATH = "token.json";
const CREDENTIALS_PATH = "credentials.json";

const config = require('./config.json');
const albumId = config.album_id;

// Auth starten
fs.readFile(CREDENTIALS_PATH, (err, content) => {
  if (err) return console.error("Error loading credentials:", err);
  authorize(JSON.parse(content), getPhotosFromAlbum);
});

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } =
    credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Token laden
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("Authorize this app:", authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter the code here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving token", err);
      oAuth2Client.setCredentials(token);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      callback(oAuth2Client);
    });
  });
}

// 🔥 HIER: Bilder aus Album holen
async function getPhotosFromAlbum(auth) {
  const photos = google.photoslibrary({ version: "v1", auth });


  let mediaItems = [];
  let nextPageToken = null;

  do {
    const res = await photos.mediaItems.search({
      requestBody: {
        albumId,
        pageSize: 50,
        pageToken: nextPageToken,
      },
    });

    mediaItems = mediaItems.concat(res.data.mediaItems || []);
    nextPageToken = res.data.nextPageToken;
  } while (nextPageToken);

  // Nur Bilder (keine Videos)
  const images = mediaItems
    .filter((item) => item.mimeType.startsWith("image/"))
    .map((item) => ({
      url: item.baseUrl + "=w800", // skaliert
      thumbnail: item.baseUrl + "=w200",
      created: item.mediaMetadata.creationTime,
    }))
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .slice(0, 20); // nur die neuesten 20

  fs.writeFileSync("photos.json", JSON.stringify(images, null, 2));

  console.log("✅ photos.json erstellt!");
}