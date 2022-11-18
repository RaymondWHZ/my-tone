// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFeaturesInfo } from '../../utils/trackFeatures';

type Data = {
  data: any
  error?: any  // put error in the response if there is any
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const playlist = req.query.playlist;
  var featuresInfo = await getFeaturesInfo(playlist);
  console.log(featuresInfo)
  // red
  var energy = featuresInfo['energy'];
  var valence = featuresInfo['valence']
  var loudness = featuresInfo['loudness']
  var liveness = featuresInfo['liveness']
  var c1_red = 256 * (0.4 * energy[2] + 0.3 * valence[2] + 0.2 * loudness[2] + 0.1 * liveness[2])
  var c2_red = 256 * (0.4 * energy[1] + 0.3 * valence[1] + 0.2 * loudness[1] + 0.1 * liveness[1])
  var c_red = (energy[2] - energy[0] + valence[2] - valence[0] + loudness[2] - loudness[0] + liveness[2] - liveness[0])
              / (energy[0] - energy[1] + valence[0] - valence[1] + loudness[0] - loudness[1] + liveness[0] - liveness[1])

  // green
  var acousticness = featuresInfo['acousticness']
  var instrumentalness = featuresInfo['instrumentalness']
  var speechiness = featuresInfo['speechiness']
  var danceability = featuresInfo['danceability']
  var c1_green = 256 * (0.4 * danceability[2] + 0.2 * speechiness[2] + 0.2 * instrumentalness[2] + 0.2 * acousticness[2])
  var c2_green = 256 * (0.4 * danceability[1] + 0.2 * speechiness[1] + 0.2 * instrumentalness[1] + 0.2 * acousticness[1])
  var c_green = (acousticness[2] - acousticness[0] + instrumentalness[2] - instrumentalness[0] + speechiness[2] - speechiness[0] + danceability[2] - danceability[0])
                / (acousticness[0] - acousticness[1] + instrumentalness[0] - instrumentalness[1] + speechiness[0] - speechiness[1] + danceability[0] - danceability[1])

  // blue
  var mode = featuresInfo['mode']
  var tempo = featuresInfo['tempo']
  var time_signature = featuresInfo['time_signature']
  var key = featuresInfo['key']
  var c1_blue = 256 * (0.4 * mode[2] + 0.4 * tempo[2] + 0.1 * key[2] + 0.1 * time_signature[2])
  var c2_blue = 256 * (0.4 * mode[1] + 0.4 * tempo[1] + 0.1 * key[1] + 0.1 * time_signature[1])
  var c_blue = (tempo[2] - tempo[0]) / (tempo[0] - tempo[1])

  console.log('red', c1_red, c2_red, c_red)
  console.log('green', c1_green, c2_green, c_green)
  console.log('blue', c1_blue, c2_blue, c_blue)

  res.status(200).json({data: {
    color_points: [
      [c1_red, c1_green, c1_blue],
      [c1_red + (c2_red - c1_red) * Math.pow(0.1, c_red), c1_blue + (c2_blue - c1_blue) * Math.pow(0.1, c_blue), c1_green + (c2_green - c1_green) * Math.pow(0.1, c_green)],
      [c1_red + (c2_red - c1_red) * Math.pow(0.2, c_red), c1_blue + (c2_blue - c1_blue) * Math.pow(0.2, c_blue), c1_green + (c2_green - c1_green) * Math.pow(0.2, c_green)],
      [c1_red + (c2_red - c1_red) * Math.pow(0.3, c_red), c1_blue + (c2_blue - c1_blue) * Math.pow(0.3, c_blue), c1_green + (c2_green - c1_green) * Math.pow(0.3, c_green)],
      [c1_red + (c2_red - c1_red) * Math.pow(0.4, c_red), c1_blue + (c2_blue - c1_blue) * Math.pow(0.4, c_blue), c1_green + (c2_green - c1_green) * Math.pow(0.4, c_green)],
      [c1_red + (c2_red - c1_red) * Math.pow(0.5, c_red), c1_blue + (c2_blue - c1_blue) * Math.pow(0.5, c_blue), c1_green + (c2_green - c1_green) * Math.pow(0.5, c_green)],
      [c1_red + (c2_red - c1_red) * Math.pow(0.6, c_red), c1_blue + (c2_blue - c1_blue) * Math.pow(0.6, c_blue), c1_green + (c2_green - c1_green) * Math.pow(0.6, c_green)],
      [c1_red + (c2_red - c1_red) * Math.pow(0.7, c_red), c1_blue + (c2_blue - c1_blue) * Math.pow(0.7, c_blue), c1_green + (c2_green - c1_green) * Math.pow(0.7, c_green)],
      [c1_red + (c2_red - c1_red) * Math.pow(0.8, c_red), c1_blue + (c2_blue - c1_blue) * Math.pow(0.8, c_blue), c1_green + (c2_green - c1_green) * Math.pow(0.8, c_green)],
      [c1_red + (c2_red - c1_red) * Math.pow(0.9, c_red), c1_blue + (c2_blue - c1_blue) * Math.pow(0.9, c_blue), c1_green + (c2_green - c1_green) * Math.pow(0.9, c_green)],
      [c2_red, c2_green, c2_blue]
    ],
    c: [c_red, c_green, c_blue],
    description: "Sample"
  }})
}
