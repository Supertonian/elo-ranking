import { connectToMongoDB } from "db/client";
import { getPlayers, insertPlayer } from "db/player";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const client = await connectToMongoDB();
    const players = await getPlayers(client);
    res.status(200).json(players);
  } else if (req.method === "POST") {
    const { body } = req;
    const { name } = body;
    const client = await connectToMongoDB();
    await insertPlayer(client, name);

    const players = await getPlayers(client);
    res.status(200).json(players);
  }
}
