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
  await sleep(2000)
  var featuresInfo = getFeaturesInfo('71uF3xQj2v6DTZyCRIvZHv');

  // red
  var energy = featuresInfo['energy']
  var valence = featuresInfo['valence']
  var loudness = featuresInfo['loudness']
  var liveness = featuresInfo['liveness']
  var c1_red = 256 * (0.4 * energy[2] + 0.3 * valence[2] + 0.2 * loudness[2] + 0.1 * liveness[2])
  var c2_red = 256 * (0.4 * energy[1] + 0.3 * valence[1] + 0.2 * loudness[1] + 0.1 * liveness[1])
  var c_red = (energy[2] - energy[0] + valence[2] - valence[0] + loudness[2] - loudness[0] + liveness[2] - liveness[0])
              / (energy[0] - energy[1] + valence[0] - valence[1] + loudness[0] - loudness[1] + liveness[0] - liveness[1])
  res.status(200).json({data: {color: 'red', c1: c1_red, c2: c2_red, c: c_red}})

  // green
  var acousticness = featuresInfo['accousticness']
  var instrumentalness = featuresInfo['instrumentalness']
  var speechiness = featuresInfo['speechiness']
  var danceability = featuresInfo['danceability']
  var c1_green = 256 * (0.4 * danceability[2] + 0.2 * speechiness[2] + 0.2 * instrumentalness[2] + 0.2 * acousticness[2])
  var c2_green = 256 * (0.4 * danceability[1] + 0.2 * speechiness[1] + 0.2 * instrumentalness[1] + 0.2 * acousticness[1])
  var c_green = (acousticness[2] - acousticness[0] + instrumentalness[2] - instrumentalness[0] + speechiness[2] - speechiness[0] + danceability[2] - danceability[0])
                / (acousticness[0] - acousticness[1] + instrumentalness[0] - instrumentalness[1] + speechiness[0] - speechiness[1] + danceability[0] - danceability[1])
  res.status(200).json({data: {color: 'green', c1: c1_green, c2: c2_green, c: c_green}})
}
