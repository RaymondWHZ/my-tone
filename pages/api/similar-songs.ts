import {NextApiRequest, NextApiResponse} from "next";
import {getRelatedSongs} from "../../utils/relatedSongs";

type Data = {
  data: any
  error?: any  // put error in the response if there is any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const playlist = req.query.playlist as string;
  const songs = await getRelatedSongs(playlist)
  res.status(200).json({ data: { songs } })
}