// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFeaturesInfo } from '../../utils/trackFeatures';

type Data = {
  data: any
  error?: any  // put error in the response if there is any
}

// Description types
interface Color {
  [key: string]: number
}

interface ColorDescription {
  high: string
  medium: string
  low: string
  varied: string
  uniform: string
}

interface ColorDescriptionDict {
  [key: string]: ColorDescription
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const playlist = req.query.playlist as string;
  const featuresInfo = await getFeaturesInfo(playlist);
  // console.log(featuresInfo)

  const energy = featuresInfo['energy'];
  const valence = featuresInfo['valence']
  const loudness = featuresInfo['loudness']
  const liveness = featuresInfo['liveness']
  const acousticness = featuresInfo['acousticness']
  const instrumentalness = featuresInfo['instrumentalness']
  const speechiness = featuresInfo['speechiness']
  const danceability = featuresInfo['danceability']
  const mode = featuresInfo['mode']
  const tempo = featuresInfo['tempo']
  const time_signature = featuresInfo['time_signature']
  const key = featuresInfo['key']

  // red dominated by energy
  var enercy_c = energy[0]
  enercy_c = Math.max(1, enercy_c * 1.3)
  const r1 = 256 * (0.5 * enercy_c + 0.5 * tempo[1])
  const r2 = 256 * (0.5 * enercy_c + 0.5 * tempo[0])
  const r3 = 256 * (0.5 * enercy_c + 0.5 * tempo[2])

  // green dominated by danceability
  var danceability_c = danceability[0]
  danceability_c = Math.max(1, danceability_c * 1.3)
  const g1 = 256 * (0.5 * danceability[0] + 0.5 * acousticness[1])
  const g2 = 256 * (0.5 * danceability[0] + 0.5 * acousticness[0])
  const g3 = 256 * (0.5 * danceability[0] + 0.5 * acousticness[2])

  //blue dominated by reverse valence
  var reverse_valence = 1.0 - valence[0]
  reverse_valence = Math.max(1, reverse_valence * 1.3)

  const b1 = 256 * (0.5 * reverse_valence + 0.5 * (1-mode[1]))
  const b2 = 256 * (0.5 * reverse_valence + 0.5 * (0.5 * (2-mode[2]-mode[1])))
  const b3 = 256 * (0.5 * reverse_valence + 0.5 * (1-mode[2]))

  // do something to mess around with this maybe
  let red1 = r1
  let red2 = r2
  let red3 = r3

  let green1 = g1
  let green2 = g2
  let green3 = g3

  let blue1 = b1
  let blue2 = b2
  let blue3 = b3

  // Descriptions
  const colorDescriptionTemplates: ColorDescriptionDict = {
    red: {
      high: "Your playlist has many energetic and high tempo songs. The overall vibe is lively and fast paced. ",
      medium: "Your playlist has some energetic, high tempo songs. Your playlist is moderately energetic overall. ",
      low: "Your playlist has few songs that are fast paced and high in energy. The overall playlist may have a more relaxed vibe and a slower tempo. ",
      varied: "Individual songs in your playlist vary widely in their energy and tempo.",
      uniform: "Songs in your playlist have comparable energy and tempo."
    },
    green: {
      high: "Your playlist is high in danceability overall. It would make a great playlist for a party! ",
      medium: "Your playlist has moderate danceability. " ,
      low: "Your playlist has low danceability. ",
      varied: "Songs in your playlist vary in the characteristic of danceability.",
      uniform: "Songs in your playlist are fairly similar in danceability."
    },
    blue: {
      high: "Many songs in your playlist have low valance (more blue). Your playlist may have an overall mood that is sad and melancholic. ",
      medium: "Songs in your playlist are balanced in their valence. The overall playlist is neither too cheerful nor too sad. ",
      low: "Songs in your playlist have a high valence (less blue) and convey cheerful, happy emotions. ",
      varied: "The mood of songs in your playlist vary. Some songs are cheerful while others are blue.",
      uniform: "The mood of songs in your playlist are fairly similar."
    }
  };

  // Thresholds (adjust)
  const highThreshold = 180;
  const mediumThreshold = 130;
  const variedThreshold = 60;

  var color1: Color = {
    red: red1,
    green: green1,
    blue: blue1
  }

  var color2: Color = {
    red: red3,
    green: green3,
    blue: blue3
  }

  console.log("Colors:")
  console.log(color1);
  console.log(color2);

  const descriptions: any = {};
  Object.keys(colorDescriptionTemplates).forEach(c => {
    let quant: string = "";
    let desc: string = "";
    if ((color1[c] + color2[c]) / 2.0 > highThreshold) {
      quant += "High and ";
      desc += colorDescriptionTemplates[c].high;
    } else if ((color1[c] + color2[c]) / 2.0 > mediumThreshold) {
      quant += "Medium and ";
      desc += colorDescriptionTemplates[c].medium;
    } else {
      quant += "Low and ";
      desc += colorDescriptionTemplates[c].low;
    }

    if (Math.abs(color1[c] - color2[c]) > variedThreshold) {
      quant += "Varied";
      desc += colorDescriptionTemplates[c].varied;
    } else {
      quant += "Uniform";
      desc += colorDescriptionTemplates[c].uniform;
    }
    descriptions[c] = {quantifier:  quant, description: desc};
  });

  res.status(200).json({data: {
    color_points: [
      [Math.round(red1), Math.round(green1), Math.round(blue1)],
      [Math.round(red1 + (red2-red1) * 0.33), Math.round(green1 + (green2-green1) * 0.33), Math.round(blue1 + (blue2-blue1) * 0.33)],
      [Math.round(red1 + (red2-red1) * 0.67), Math.round(green1 + (green2-green1) * 0.67), Math.round(blue1 + (blue2-blue1) * 0.67)],
      [Math.round(red2), Math.round(green2), Math.round(blue2)],
      [Math.round(red2 + (red3-red2) * 0.5), Math.round(green2 + (green3-green2) * 0.5), Math.round(blue2 + (blue3-blue2) * 0.5)],
      [Math.round(red3), Math.round(green3), Math.round(blue3)]
    ],
    c: [1, 1, 1],
    description: descriptions
  }})
}
