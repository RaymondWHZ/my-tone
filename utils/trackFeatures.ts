const calculateMeanQuartile = (arr: number[]) => {
  var l = [];

  const asc = (arr: number[]) => arr.sort((a, b) => a - b);
  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  const mean = (arr: number[]) => sum(arr) / arr.length;

  const quantile = (arr: number[], q: number) => {
      const sorted = asc(arr);
      const pos = (sorted.length - 1) * q;
      const base = Math.floor(pos);
      const rest = pos - base;
      if (sorted[base + 1] !== undefined) {
          return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
      } else {
          return sorted[base];
      }
  };
  const q25 = (arr: number[]) => quantile(arr, .25);
  const q75 = (arr: number[]) => quantile(arr, .75);

  l.push(mean(arr), q25(arr), q75(arr));
  return l;
}

const normalize = (arr: number[], min: number, max: number) => {
  var l = [];
  l.push((arr[0] - min) / (max - min));
  l.push((arr[1] - min) / (max - min));
  l.push((arr[2] - min) / (max - min));

  return l;
}

export const getFeaturesInfo = async (playlist: string): Promise<any> => {
  const SpotifyWebApi = require('../node_modules/spotify-web-api-node');

  var cId: string = process.env.SPOTIFY_CLIENT_ID;
  var cSec: string = process.env.SPOTIFY_CLIENT_SECRET;
  var refTok: string = process.env.SPOTIFY_REFRESH_TOKEN;

  console.log(cId+ ' ***\n' + cSec + '***\n'+ refTok);

  const spotifyApi = new SpotifyWebApi({
    clientId : cId,
    clientSecret: cSec,
    refreshToken: refTok
  });

  const refreshTokenResponse = await spotifyApi.refreshAccessToken()
  console.log('The access token has been refreshed ::: ' + refreshTokenResponse.body['access_token']);
  spotifyApi.setAccessToken(refreshTokenResponse.body['access_token']);


  var tracks: string[] = [];
  var features=['danceability','energy','key','loudness','speechiness','acousticness','instrumentalness',
                  'liveness','valence','tempo','time_signature','mode'];
  var featureValues: { [key: string]: any } = {};
  var featuresInfo: { [key: string]: any } = {};

  const data = await spotifyApi.getPlaylistTracks(playlist, {
      offset: 1,
      limit: 5,
      fields: 'items'
  })

  var items: any[] = data.body.items;
  //console.log('Items : ', items);
  items.forEach(element => {
    //console.log('TrackId : ', element.track.id);
    tracks.push(element.track.id);
  });
  console.log('The playlist contains these tracks', tracks);

  const featureData = await spotifyApi.getAudioFeaturesForTracks(tracks)
  //console.log('data : ', data.body);
  var audioFeatures: any[] =featureData.body.audio_features;
  audioFeatures.forEach(element => {
      features.forEach(feature => {
          //console.log('feature name :',element[feature]);
          featureValues[feature] = featureValues[feature] || [];
          featureValues[feature].push(element[feature]);
      });
  });

  // console.log('featureValues ::: ', featureValues);

  for (const [key, value] of Object.entries(featureValues)) {
    featuresInfo[key] = calculateMeanQuartile(featureValues[key]);
    if(key == 'key') {
      featuresInfo[key] = normalize(featuresInfo[key], -1, 11);
    } else if(key=='loudness') {
      featuresInfo[key] = normalize(featuresInfo[key], -60, 0);
    } else if(key=='time_signature') {
      featuresInfo[key] = normalize(featuresInfo[key], 3, 7);
    }
  }

  // console.log('featuresInfo ::: ', featuresInfo);
  return featuresInfo
};