// lib/spotify.ts
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  refreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
});

let tokenExpiration = 0;

export async function getSpotifyClient() {
  if (Date.now() > tokenExpiration - 60000) { // Refresh 1 min early
    const data = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(data.body.access_token);
    tokenExpiration = Date.now() + data.body.expires_in * 1000;
  }
  return spotifyApi;
}