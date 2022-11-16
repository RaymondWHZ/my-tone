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
  res.status(200).json({ data: { color: "red" } })
}
