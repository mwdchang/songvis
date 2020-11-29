const fs = require('fs');
const SpotifyWebApi = require('spotify-web-api-node');
const _ = require('lodash');

require('dotenv').config();

const filename = process.argv[2];

// credentials are optional
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_SECRET
});


// const trackId = '48UPSzbZjgc449aqz8bxox';
async function extractData(name, trackId) {
  /* Track */
  const data = await spotifyApi.getTracks([trackId]);
  const track = data.body.tracks[0];
  if (!track) {
    console.error(`unabled to process ${name}, ${trackId}`);
    return;
  }

  const trackAlbum = track.album;
  const trackName = track.name;
  const trackPopularity = track.popularity;
  const trackDuration = +((track.duration_ms / 1000) / 60).toFixed(2);

  /* Album */
  const albumId = trackAlbum.id;
  const album = (await spotifyApi.getAlbum(albumId)).body;
  const albumImage = album.images[0].url;
  const albumReleaseDate = album.release_date;
  const albumReleaseYear = albumReleaseDate.split('-')[0];
  const albumArtistIds = album.artists.map(a => a.id);

  /* Artists */
  const albumArtists = (await spotifyApi.getArtists(albumArtistIds)).body;
  const albumArtistsNames = albumArtists.artists.map(d => d.name).join('|');
  const albumArtistsPopularites = albumArtists.artists.map(d => d.popularity).join('|');
  const albumArtistsGenres = _.uniq(_.flatten(albumArtists.artists.map(d => d.genres))).join('|');

  const albumArtistsTopTracks = (await spotifyApi.getArtistTopTracks(albumArtistIds[0], 'US')).body;
  const albumArtistsTopTrackNames = _.take(albumArtistsTopTracks.tracks.map(d => d.name), 3).join('|');

  /* Features */
  const feature = (await spotifyApi.getAudioFeaturesForTrack(trackId)).body;
  const featureDanceability = feature.danceability;
  const featureEnergy = feature.energy;
  const featureValence = feature.valence;
  const featureTempo = feature.tempo;

  const columns = [
    name,
    trackName,
    trackId,
    trackPopularity,
    trackDuration,
    featureValence,
    featureEnergy,
    featureDanceability,
    featureTempo,
    albumImage,
    albumArtistsNames,
    albumArtistsPopularites,
    albumArtistsTopTrackNames,
    albumArtistsGenres,
    albumReleaseYear
  ];
  console.log(columns.join('\t'));
}


async function processList() {
  const list = (fs.readFileSync(filename, 'utf8')).split('\n');
  const columns = [
    'name',
    'song',
    'trackId',
    'popularity',
    'duration',
    'valence',
    'energy',
    'danceability',
    'tempo',
    'albumImage',
    'artist',
    'artistPopularity',
    'artistTopTracks',
    'artistGenres',
    'releaseYear'
  ];
  console.log(columns.join('\t'));

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (!item || item.startsWith('##') || item === '') continue;
    let [name, trackId] = item.split(',');
    name = name.trim();
    trackId = trackId.trim();
    await extractData(name, trackId).catch(error => {
      console.error(error);
    });
  }
}

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    // console.log('The access token expires in ' + data.body['expires_in']);
    // console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    // spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setAccessToken(data.body.access_token);
    processList();
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);
