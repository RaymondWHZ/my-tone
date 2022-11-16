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
  const q25 = arr => quantile(arr, .25);
  const q75 = arr => quantile(arr, .75);
  
  l.push(mean(arr), q25(arr), q75(arr));
  return l;
}

const getFeaturesInfo = (playlist) => {

    const SpotifyWebApi = require('../../node_modules/spotify-web-api-node');

    const spotifyApi = new SpotifyWebApi({
        accessToken: 'BQDpYxhsRFYTkZznkdujDpXmArfBosjc9F9noiBCwDxJUkODcUJr5XdaMxYvQEkOnxLQ9JT9iglvC3OEgD_LqbE02RsTJxPd3-PZGlTeQP4THvAJAbKSVnnEWKu4KdtAcWHs1kRD0vAPXT0PpXyfDG4XV_TEKmOshnTY7F6BzLR1'
    });

    var tracks=[];
    var features=['danceability','energy','key','loudness','speechiness','acousticness','instrumentalness',
                    'liveness','valence','tempo','time_signature','mode'];
    var featureValues = {};
    var featuresInfo = {};

    spotifyApi.getPlaylistTracks(playlist, {
        offset: 1,
        limit: 5,
        fields: 'items'
      })
      .then(
        function(data) {
          var items = data.body.items;
          //console.log('Items : ', items);
          items.forEach(element => {
            //console.log('TrackId : ', element.track.id);
            tracks.push(element.track.id);
          });
          console.log('The playlist contains these tracks', tracks);
          
          spotifyApi.getAudioFeaturesForTracks(tracks)
            .then(
                function(data) {
                    //console.log('data : ', data.body);
                    var audioFeatures=data.body.audio_features;
                    audioFeatures.forEach(element => {
                        features.forEach(feature => {
                            //console.log('feature name :',element[feature]);
                            featureValues[feature] = featureValues[feature] || [];
                            featureValues[feature].push(element[feature]);
                        });
                    });

                    console.log('featureValues ::: ', featureValues);
                    
                    for (const [key, value] of Object.entries(featureValues)) {
                      featuresInfo[key] = calculateMeanQuartile(featureValues[key]);
                    }

                    console.log('featuresInfo ::: ', featuresInfo);
                },
                function(err) {
                    console.log('Something went wrong!', err);
                }
          );
        },
        function(err) {
          console.log('Something went wrong!', err);
        }
      );
};

getFeaturesInfo('71uF3xQj2v6DTZyCRIvZHv');
