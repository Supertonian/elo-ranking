const { MongoClient } = require("mongodb");

// Function to connect to MongoDB and return the database client
export async function connectToMongoDB() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    throw error; // Rethrow the error so the caller is aware that the connection failed.
  }
}
