// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFeaturesInfo } from '../../utils/trackFeatures';

type Data = {
  data: any
  error?: any  // put error in the response if there is any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const playlist = req.query.playlist as string;
    const featuresInfo = await getFeaturesInfo(playlist);
    console.log(featuresInfo)
    // red
    const energy = featuresInfo['energy'];
    const valence = featuresInfo['valence']
    const loudness = featuresInfo['loudness']
    const liveness = featuresInfo['liveness']
    let c1_red = 256 * (0.4 * energy[2] + 0.3 * valence[2] + 0.2 * loudness[2] + 0.1 * liveness[2])
    let c2_red = 256 * (0.4 * energy[1] + 0.3 * valence[1] + 0.2 * loudness[1] + 0.1 * liveness[1])
    let c_red = (energy[2] - energy[0] + valence[2] - valence[0] + loudness[2] - loudness[0] + liveness[2] - liveness[0])
      / (energy[0] - energy[1] + valence[0] - valence[1] + loudness[0] - loudness[1] + liveness[0] - liveness[1])

    // green
    const acousticness = featuresInfo['acousticness']
    const instrumentalness = featuresInfo['instrumentalness']
    const speechiness = featuresInfo['speechiness']
    const danceability = featuresInfo['danceability']
    let c2_green = 256 * (0.4 * danceability[2] + 0.2 * speechiness[2] + 0.2 * instrumentalness[2] + 0.2 * acousticness[2])
    let c1_green = 256 * (0.4 * danceability[1] + 0.2 * speechiness[1] + 0.2 * instrumentalness[1] + 0.2 * acousticness[1])
    let c_green = (acousticness[2] - acousticness[0] + instrumentalness[2] - instrumentalness[0] + speechiness[2] - speechiness[0] + danceability[2] - danceability[0])
      / (acousticness[0] - acousticness[1] + instrumentalness[0] - instrumentalness[1] + speechiness[0] - speechiness[1] + danceability[0] - danceability[1])

    // blue
    const mode = featuresInfo['mode']
    const tempo = featuresInfo['tempo']
    const time_signature = featuresInfo['time_signature']
    const key = featuresInfo['key']
    let c2_blue = 256 * (0.7 * mode[2] + 0.1 * tempo[2] + 0.1 * key[2] + 0.1 * time_signature[2])
    let c1_blue = 256 * (0.7 * mode[1] + 0.1 * tempo[1] + 0.1 * key[1] + 0.1 * time_signature[1])
    let c_blue = (tempo[2] - tempo[0]) / (tempo[0] - tempo[1])

    console.log('red', c1_red, c2_red, c_red)
    console.log('green', c1_green, c2_green, c_green)
    console.log('blue', c1_blue, c2_blue, c_blue)

    c1_red = Math.min(1.2 * c1_red, 255)
    c1_green = 0.75 * c1_green
    c1_blue = 0.4 * c1_blue

    c2_red = 0.75 * c2_red
    c2_green = 0.75 * c2_green
    c2_blue = Math.min(1.2 * c2_blue, 255)

    const c = 1

    res.status(200).json({data: {
        color_points: [
          [Math.round(c1_red), Math.round(c1_green), Math.round(c1_blue)],
          [Math.round(c1_red + (c2_red - c1_red) * Math.pow(0.2, c)), Math.round(c1_green + (c2_green - c1_green) * Math.pow(0.2, c)), Math.round(c1_blue + (c2_blue - c1_blue) * Math.pow(0.2, c))],
          [Math.round(c1_red + (c2_red - c1_red) * Math.pow(0.4, c)), Math.round(c1_green + (c2_green - c1_green) * Math.pow(0.4, c)), Math.round(c1_blue + (c2_blue - c1_blue) * Math.pow(0.4, c))],
          [Math.round(c1_red + (c2_red - c1_red) * Math.pow(0.6, c)), Math.round(c1_green + (c2_green - c1_green) * Math.pow(0.6, c)), Math.round(c1_blue + (c2_blue - c1_blue) * Math.pow(0.6, c))],
          [Math.round(c1_red + (c2_red - c1_red) * Math.pow(0.8, c)), Math.round(c1_green + (c2_green - c1_green) * Math.pow(0.8, c)), Math.round(c1_blue + (c2_blue - c1_blue) * Math.pow(0.8, c))],
          [Math.round(c2_red), Math.round(c2_green), Math.round(c2_blue)]
        ],
        c: [c_red, c_green, c_blue],
        description: "Sample"
      }})
  } catch (e) {
    res.status(200).json({data: {}, error: e})
  }
}
