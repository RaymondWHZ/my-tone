const SpotifyWebApi = require('../node_modules/spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId : '4a13ead1dc754e9ea3f61616b009cc8a',
    clientSecret: 'c199f4ce1f3440fba48363e073d628c6',
    refreshToken: 'AQATAfzsStaw869U-Fs-bEXd16zNpKFSiX0NbcJyg0JZj9RE0sqMW5wpGilWdG57HL95tk5BCyZPGLlGDHIQc2idLyaHqESZC-_HvRkW_UVP_9mJH_XldcwBe-b-c60NH4k'
  });

spotifyApi.refreshAccessToken().then(
    function(refreshTokenResponse) {
        console.log('The access token has been refreshed ::: ' + refreshTokenResponse.body['access_token']);
        spotifyApi.setAccessToken(refreshTokenResponse.body['access_token']);


        var tracks = [];
        var features=['danceability','energy','key','loudness','speechiness','acousticness','instrumentalness',
                        'liveness','valence','tempo','time_signature','mode'];
        var featureValues = {};
        var featuresInfo = {};

        spotifyApi.getPlaylistTracks('1xNWydoMmA8210KeHU948w', {
            offset: 1,
            limit: 5,
            fields: 'items'}).then(
          function(data) {
            var items = data.body.items;
            //console.log('Items : ', items);
            items.forEach(element => {
                //console.log('TrackId : ', element.track.id);
                tracks.push(element.track.id);
            });
            console.log('The playlist contains these tracks', tracks);
        });
    });