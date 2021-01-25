const mongoose = require("mongoose");
import User from "@/models/user";

const connection = {}; /* creating connection object*/

const connectionURL = "mongodb://127.0.0.1:27017" || process.env.MONGODB_URL;
const databaseName = "task-manager-api";

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false, // uses findOneAndUpdate instead
};

async function dbConnect() {
  /* check if we have connection to our databse*/
  if (connection.isConnected) {
    return;
  }
  /* connecting to our database */
  const db = await mongoose.connect(
    `${connectionURL}/${databaseName}`,
    options
  );

  connection.isConnected = db.connections[0].readyState;

  // console.log(db)
  return connection;
}

export default dbConnect;
