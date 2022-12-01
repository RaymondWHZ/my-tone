import SpotifyWebApi from "spotify-web-api-node";
import { getFeaturesInfo } from './trackFeatures';
import {Song} from "../types/types";

export const getRelatedSongs = async (playlist: string): Promise<Song[]> => {
    const featuresInfo = await getFeaturesInfo(playlist)
    const options: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(featuresInfo)) {
        let valArr = value as number[];
        if(key!="artists" && key!="tracks" && key!="key" && key!="mode" && key!="time_signature" && key!="tempo") { 
            options["target_"+key] = valArr[0];
        }
    }
    options["seed_artists"] = featuresInfo["artists"];
    options["seed_tracks"] = featuresInfo["tracks"];
    console.log(options);

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
    console.log('The access token has been refreshed');
    spotifyApi.setAccessToken(refreshTokenResponse.body['access_token']);
    let recommended_tracks: Song[] = [];
    const data = await spotifyApi.getRecommendations(options)
    //console.log(data.body);
    const tracks = data.body.tracks;
    //console.log('Items : ', items);
    for(const element in tracks) {
        //console.log(tracks[element]);
        let trackName: string = tracks[element].name;
        let trackImgs: any[] = tracks[element].album.images;
        let artistName: string = tracks[element].album.artists[0].name;
        recommended_tracks.push({
            name: trackName,
            image: trackImgs[2].url,
            artist: artistName
        })
    }
    return recommended_tracks;
}
