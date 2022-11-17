const calculateMeanQuartile = (arr) => {
  var l = [];

  const asc = arr => arr.sort((a, b) => a - b);
  const sum = arr => arr.reduce((a, b) => a + b, 0);
  const mean = arr => sum(arr) / arr.length;

  const quantile = (arr, q) => {
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
  const q25 = (arr) => quantile(arr, .25);
  const q75 = arr => quantile(arr, .75);

  l.push(mean(arr), q25(arr), q75(arr));
  return l;
}

export const getFeaturesInfo = async (playlist) => {
  const SpotifyWebApi = require('../node_modules/spotify-web-api-node');

  const spotifyApi = new SpotifyWebApi({
      accessToken: 'BQDzv9Jfd8o2qeWs6gkjf2WhcYldLYqsQXNgfHxYiyQsjhhJaEZq_ScNJu1fVXnhJOUOvPj6QknnGy5isRrEGenAp0NSJFazOwXDlUAmLsP7Bo2RGCjuTe_jiaKLy3jMDXXH2stA94GPJgl6xnDuhmPLCvWj2psVo2rXMFbqakLM'
  });

  var tracks: string[] = [];
  var features=['danceability','energy','key','loudness','speechiness','acousticness','instrumentalness',
                  'liveness','valence','tempo','time_signature','mode'];
  var featureValues = {};
  var featuresInfo = {};

  const data = await spotifyApi.getPlaylistTracks(playlist, {
      offset: 1,
      limit: 5,
      fields: 'items'
  })

  var items = data.body.items;
  //console.log('Items : ', items);
  items.forEach(element => {
    //console.log('TrackId : ', element.track.id);
    tracks.push(element.track.id);
  });
  console.log('The playlist contains these tracks', tracks);

  const featureData = await spotifyApi.getAudioFeaturesForTracks(tracks)
  //console.log('data : ', data.body);
  var audioFeatures=featureData.body.audio_features;
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
  }

  // console.log('featuresInfo ::: ', featuresInfo);
  return featuresInfo
};
