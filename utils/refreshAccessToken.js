const SpotifyWebApi = require('../node_modules/spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
    clientId : '4a13ead1dc754e9ea3f61616b009cc8a',
    clientSecret: 'c199f4ce1f3440fba48363e073d628c6',
    refreshToken: 'AQATAfzsStaw869U-Fs-bEXd16zNpKFSiX0NbcJyg0JZj9RE0sqMW5wpGilWdG57HL95tk5BCyZPGLlGDHIQc2idLyaHqESZC-_HvRkW_UVP_9mJH_XldcwBe-b-c60NH4k'
});

spotifyApi.refreshAccessToken().then(
    function(data) {
      console.log('The access token has been refreshed ::: ' + data.body['access_token']);
      spotifyApi.setAccessToken(data.body['access_token']);
    },
    function(err) {
      console.log('Could not refresh access token', err);
    }
  );