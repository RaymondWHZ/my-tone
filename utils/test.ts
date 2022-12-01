import SpotifyWebApi from "spotify-web-api-node";
import { getFeaturesInfo } from './trackFeatures';

const playlist = '37i9dQZF1EIZCsyhLFyG4d';
getFeaturesInfo(playlist).then(
    function(featuresInfo: any) {
        const options: { [key: string]: any } = {};
        for (const [key, value] of Object.entries(featuresInfo)) {
            let valArr = value as number[];
            if(key!="artists" && key!="tracks" && key!="key" && key!="mode" && key!="time_signature"
                    && key!="tempo") { 
                options["target_"+key] = valArr[0];
            }
        }
        options["seed_artists"] = featuresInfo["artists"];
        options["seed_tracks"] = featuresInfo["tracks"];
        console.log(options);

        let cId = "4a13ead1dc754e9ea3f61616b009cc8a"; //process.env.SPOTIFY_CLIENT_ID as string;
        let cSec = "c199f4ce1f3440fba48363e073d628c6"; //process.env.SPOTIFY_CLIENT_SECRET as string;
        let refTok = "AQATAfzsStaw869U-Fs-bEXd16zNpKFSiX0NbcJyg0JZj9RE0sqMW5wpGilWdG57HL95tk5BCyZPGLlGDHIQc2idLyaHqESZC-_HvRkW_UVP_9mJH_XldcwBe-b-c60NH4k"; //process.env.SPOTIFY_REFRESH_TOKEN as string;
        const spotifyApi = new SpotifyWebApi({
            clientId : cId,
            clientSecret: cSec,
            refreshToken: refTok
        });
        spotifyApi.refreshAccessToken().then(
            function(refreshTokenResponse: any) {
                console.log('The access token has been refreshed ::: ' + refreshTokenResponse.body['access_token']);
                spotifyApi.setAccessToken(refreshTokenResponse.body['access_token']);

                let recommended_tracks: string[][] = [];
                spotifyApi.getRecommendations(options).then(
                    function(data: any) {
                        //console.log(data.body);
                        const tracks = data.body.tracks;
                        //console.log('Items : ', items);
                        for(const element in tracks) {
                            //console.log(tracks[element]);
                            let trackName: string = tracks[element].name;
                            let trackImgs: any[] = tracks[element].album.images;
                            recommended_tracks.push([trackName, trackImgs[2].url]);
                        }
                        console.log(recommended_tracks);
                    }, function(err: any) {
                        console.log("Something went wrong!", err);
                      }
                )
            }
        )
    }
);