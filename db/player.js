// Function to get all players from the database
export async function getPlayers(client) {
  try {
    const players = await client
      .db("tabletennis")
      .collection("player")
      .find({})
      .sort({ rating: -1 })
      .toArray(); // Retrieves all players as an array
    return players;
  } catch (error) {
    console.error("Error running query on MongoDB Atlas:", error);
    throw error; // Rethrow the error so the caller is aware that the operation failed.
  } finally {
    client.close(); // Ensure you close the connection after the operation is done
    console.log("Disconnected from MongoDB Atlas");
  }
}

// Function to insert a new player into the database
export async function insertPlayer(client, playerName) {
  try {
    const result = await client
      .db("tabletennis")
      .collection("player")
      .insertOne({
        name: playerName,
        wins: 0,
        losses: 0,
        rating: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    console.log(`New player inserted with id ${result.insertedId}`);
  } catch (error) {
    console.error("Error running query on MongoDB Atlas:", error);
    throw error; // Rethrow the error so the caller is aware that the operation failed.
  } finally {
    client.close(); // Ensure you close the connection after the operation is done
    console.log("Disconnected from MongoDB Atlas");
  }
}
