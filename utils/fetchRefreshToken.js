const SpotifyWebApi = require('../node_modules/spotify-web-api-node');

var scopes = ['playlist-read-private'],
  redirectUri = 'http://localhost:3000/callback',
  clientId = '4a13ead1dc754e9ea3f61616b009cc8a',
  state = 'some-state';

var spotifyApi = new SpotifyWebApi({
  redirectUri: redirectUri,
  clientId: clientId,
  clientSecret: 'c199f4ce1f3440fba48363e073d628c6'
});


var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
console.log(authorizeURL);

var code = 'AQBnxclhjk7c9dtVclj95p5pUQYBGId3ENMvneBkiNui_u8FMTcRk85h4vd2_fIyzUHFlR3CHrFy12KECQOc-idO5AJ9FAobQokpjRj1XLZ9ItWbjPFenamSJ9AQhZgsuY6u52EYmZuiza6JWJBcT74nk53OvCcq40deu5_sy4cQAXq1sKxpjak3jV0ev_2APeW5DP2bctDn';

spotifyApi.authorizationCodeGrant(code).then(
    function(data) {
      console.log('The token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
      console.log('The refresh token is ' + data.body['refresh_token']);
  
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
    },
    function(err) {
      console.log('Something went wrong!', err);
    }
);