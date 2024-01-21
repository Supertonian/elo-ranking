import { connectToMongoDB } from "db/client";
import { insertMatch, getMatches } from "db/match";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { body } = req;
    const { playerAId, playerBId, scoreA, scoreB } = body;
    const client = await connectToMongoDB();

    await insertMatch(client, playerAId, playerBId, scoreA, scoreB);
    res.status(200).json([]);
  } else if (req.method === "GET") {
    const client = await connectToMongoDB();
    const matches = await getMatches(client);
    res.status(200).json(matches);
  }
}
