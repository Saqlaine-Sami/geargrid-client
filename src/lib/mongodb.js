import { MongoClient } from "mongodb";

const rawUri = process.env.MONGODB_URI || "";
const isValidUri =
  rawUri.startsWith("mongodb://") || rawUri.startsWith("mongodb+srv://");
const uri = isValidUri
  ? rawUri
  : "mongodb://127.0.0.1:27017/equipmentRentalDB";

const dbName =
  process.env.MONGODB_DB_NAME || process.env.DB_NAME || "equipmentRentalDB";

let client;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri);
  }
  client = global._mongoClient;
} else {
  client = new MongoClient(uri);
}

const db = client.db(dbName);

export { client, db };
