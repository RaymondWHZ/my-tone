import SpotifyWebApi from "spotify-web-api-node";

const calculateMeanQuartile = (arr: number[]) => {
  const l = [];

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
  const l = [];
  l.push((arr[0] - min) / (max - min));
  l.push((arr[1] - min) / (max - min));
  l.push((arr[2] - min) / (max - min));

  return l;
}

export const getFeaturesInfo = async (playlist: string): Promise<any> => {
  let cId = process.env.SPOTIFY_CLIENT_ID as string; 
  let cSec = process.env.SPOTIFY_CLIENT_SECRET as string; 
  let refTok = process.env.SPOTIFY_REFRESH_TOKEN as string; 
  
  console.log(cId+ ' ***\n' + cSec + '***\n'+ refTok);

  const spotifyApi = new SpotifyWebApi({
    clientId : cId,
    clientSecret: cSec,
    refreshToken: refTok
  });

  const refreshTokenResponse = await spotifyApi.refreshAccessToken()
  console.log('The access token has been refreshed ::: ' + refreshTokenResponse.body['access_token']);
  spotifyApi.setAccessToken(refreshTokenResponse.body['access_token']);

  let tracks: string[] = [];
  let artists: string[] = [];

  const features=['danceability','energy','key','loudness','speechiness','acousticness','instrumentalness',
                  'liveness','valence','tempo','time_signature','mode'];
  const featureValues: { [key: string]: any } = {};
  const featuresInfo: { [key: string]: any } = {};

  const data = await spotifyApi.getPlaylistTracks(playlist, {
      offset: 1,
      limit: 100,
      fields: 'items'
  })

  const items = data.body.items;
  //console.log('Items : ', items);
  items.forEach(element => {
    //console.log('TrackId : ', element.track.id);
    tracks.push(element.track!.id);
    let artistList: any[] = element.track!.artists!;
    artists.push(artistList[0].id);
  });
  //console.log('The playlist contains these tracks', tracks);
  //console.log('The playlist containes these artists', artists);
  featuresInfo["tracks"] = tracks.slice(0, 2);
  featuresInfo["artists"] = artists.slice(0, 3);

  const featureData = await spotifyApi.getAudioFeaturesForTracks(tracks)
  //console.log('data : ', data.body);
  const audioFeatures = featureData.body.audio_features;
  audioFeatures.forEach(element => {
    features.forEach(feature => {
      //console.log('feature name :',element[feature]);
      featureValues[feature] = featureValues[feature] || [];
      // @ts-ignore
      featureValues[feature].push(element[feature]);
    });
  });

  // console.log('featureValues ::: ', featureValues);

  for (const [key, value] of Object.entries(featureValues)) {
    featuresInfo[key] = calculateMeanQuartile(value);
    if(key == 'key') {
      featuresInfo[key] = normalize(featuresInfo[key], -1, 11);
    } else if(key=='loudness') {
      featuresInfo[key] = normalize(featuresInfo[key], -60, 0);
    } else if(key=='time_signature') {
      featuresInfo[key] = normalize(featuresInfo[key], 3, 7);
    } else if(key=='tempo') {
      featuresInfo[key] = normalize(featuresInfo[key], 1, 200);

      const temp: number[] = [];
      featuresInfo[key].forEach((val:number, i:number) => {
        if(val<0) temp[i]=0;
        else if(val>1) temp[i]=1;
        else temp[i]=val;
      });
      featuresInfo[key]=temp;
    }
  }

  // console.log('featuresInfo ::: ', featuresInfo);
  return featuresInfo
};