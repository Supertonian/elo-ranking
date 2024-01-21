import { ObjectId } from "mongodb";

export async function insertMatch(client, playerA, playerB, scoreA, scoreB) {
  try {
    await client
      .db("tabletennis")
      .collection("match")
      .insertOne({
        playerA: playerA,
        playerB: playerB,
        scoreA: scoreA,
        scoreB: scoreB,
        playerAWin: scoreA > scoreB,
        playerBWin: scoreB > scoreA,
        timestamp: new Date(),
      });
    // caculate Elo rating by this match result, and update it to player collection
    // get playerA's rating
    const playerAData = await client
      .db("tabletennis")
      .collection("player")
      .findOne({ _id: new ObjectId(playerA) });

    // get playerB's rating
    const playerBData = await client
      .db("tabletennis")
      .collection("player")
      .findOne({ _id: new ObjectId(playerB) });

    // calculate expected score
    const expectedScoreA =
      1 / (1 + Math.pow(10, (playerBData.rating - playerAData.rating) / 400));

    const expectedScoreB =
      1 / (1 + Math.pow(10, (playerAData.rating - playerBData.rating) / 400));

    // calculate new rating
    const newRatingA =
      playerAData.rating +
      32 * ((scoreA > scoreB ? 1 : 0) - expectedScoreA) +
      0;

    const newRatingB =
      playerBData.rating +
      32 * ((scoreB > scoreA ? 1 : 0) - expectedScoreB) +
      0;

    // update playerA's rating
    await client
      .db("tabletennis")
      .collection("player")
      .updateOne(
        { _id: new ObjectId(playerA) },
        {
          $set: {
            rating: newRatingA,
            updatedAt: new Date(),
            wins: playerAData.wins + (scoreA > scoreB ? 1 : 0),
            losses: playerAData.losses + (scoreA < scoreB ? 1 : 0),
          },
        }
      );

    // update playerB's rating
    await client
      .db("tabletennis")
      .collection("player")
      .updateOne(
        { _id: new ObjectId(playerB) },
        {
          $set: {
            rating: newRatingB,
            updatedAt: new Date(),
            wins: playerBData.wins + (scoreB > scoreA ? 1 : 0),
            losses: playerBData.losses + (scoreB < scoreA ? 1 : 0),
          },
        }
      );
  } catch (error) {
    console.error("Error running query on MongoDB Atlas:", error);
  } finally {
    client.close(); // Ensure you close the connection after the operation is done
    console.log("Disconnected from MongoDB Atlas");
  }
}

export async function getMatches(client) {
  try {
    const matches = await client
      .db("tabletennis")
      .collection("match")
      .find({})
      .limit(20)
      .toArray();
    return matches;
  } catch (error) {
    console.error("Error running query on MongoDB Atlas:", error);
    throw error;
  } finally {
    client.close();
    console.log("Disconnected from MongoDB Atlas");
  }
}
