// ========================================================
// https://tinyurl.com/y2jav2w4 // repo file source
// https://hoangvvo.com/blog/nextjs-middleware // next-connect/mongo
// ========================================================


const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

// ========================================================
// NOTE:  Manually setting ObjectID
// -- see insert example at bottom of file
// manually create and populate the ObjectID
// ========================================================
// const id = new ObjectID() // instantiate new objectid instance
// console.log("id", id) // => id 600b80573b01d064b2e52163 // log new value
// ObjectID also contains the timestamp as part of it's value
// console.log("timestamp:", id.getTimestamp()) // => timestamp: 2021-01-23T01:48:07.000Z

if (!connectionURL) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

if (!databaseName) {
  throw new Error(
    "Please define the MONGODB_DB environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo;

if (!cached) cached = global.mongo = { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  let options = {};

  if (!cached.promise) {
    options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = MongoClient.connect(connectionURL, options)
      .then((client) => {
        // handle success
        // ========================================================
        // ========================================================
        // USAGE: PASTE DB OPERATIONS BELOW
        // ========================================================
        // UNCOMMENT BELOW to run db operations in the example operations below
        const db = client.db(databaseName);
        console.log("connected to database");

        return { client, db };
      })
      // handle errors
      .catch((err) => console.log("unable to connect to database!", err));
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// ========================================================
// USAGE: COPY AND PASTE THE OPERATIONS BELOW AFTER "db"
// ========================================================
// ========================================================
// ========================================================
// ========================================================
// ========================================================
// ========================================================
// OBJECTIVE: Insert Single Document
// ========================================================
// db.collection("users").insertOne(
//   {
//     name: "Andrew",
//     age: 27,
//   },
//   (err, result) => {
//     if (err) return console.log("Unable to insert user");
//     console.log(result.ops);
//   }
// );
// ========================================================

// ========================================================
// OBJECTIVE: Insert Multiple Documents
// ========================================================
// db.collection("users").insertMany(
//   [
//     { name: "Jen", age: 28 },
//     { name: "Gunther", age: 27 },
//   ],
//   (err, result) =>
//     !err
//       ? console.log(result.ops)
//       : console.log("unable to insert documents")
// );
// ========================================================

// ========================================================
// OBJECTIVE: Insert Multiple Documents
// ========================================================
// db.collection("tasks").insertMany(
//   [
//     { description: "Task 1", completed: true },
//     { description: "Task 2", completed: false },
//     { description: "Task 3", completed: false },

//   ],
//   (err, result) =>
//     !err
//       ? console.log(result.ops)
//       : console.log("unable to insert documents")
// );
// ========================================================

// ========================================================
// OBJECTIVE: insert a new document with manually generated id:
// ========================================================
// db.collection("users").insertOne(
//   {
//     _id: id,
//     name: "Vikram",
//     age: 26,
//   },
//   (err, result) =>
//     !err
//       ? // => { _id: 600b80573b01d064b2e52163, name: 'Vikram', age:
//         console.log(result.ops)
//       : console.log("unable to insert documents")
// );
// ========================================================

// ========================================================
// OBJECTIVE:  Query Documents: Find a single user by name
// ========================================================
// db.collection('users').findOne({ name: 'Jen'}, (err, user) => {
//       !err
//         ? console.log(user)
//         : // => { _id: 600b7c863b01d064b2e5215a, name: 'Jen', age: 28 }
//           console.log("unable to fetch document");
// })
// ========================================================

// ========================================================
// OBJECTIVE:  Query Documents: Find a single user by ObjectID
// ========================================================
// db.collection("users").findOne(
//   { _id: new ObjectID("600b7c863b01d064b2e5215a") },
//   (err, user) => {
//     !err
//       ? console.log(user)
//       : // => { _id: 600b7c863b01d064b2e5215a, name: 'Jen', age: 28 }
//         console.log("unable to fetch document");
//   }
// );
// ========================================================

// ========================================================
// OBJECTIVE:  Query Documents: Find a multiple users by age
// ========================================================
// db.collection("users")
//   .find({ age: 27 })
//   // NOTE: find DOES NOT return an array by default rather it returns a cursor
//   // which is why we use .toArray() in order to put the data into an array for us
//   .toArray((err, users) => {
//     !err
//       ? console.log(users)
//       : /* =>
//         [
//           { _id: 600b7a8a3b01d064b2e52158, name: 'Andrew', age: 27 },
//           { _id: 600b7b483b01d064b2e52159, name: 'Andrew', age: 27 },
//           { _id: 600b7c863b01d064b2e5215b, name: 'Gunther', age: 27 }
//         ]
//       */
//         console.log("unable to fetch document");
//   });
// ========================================================
// NOTE: Cursor that is returned from find() can be used to perform operations
// on our data directly on the server-side, which keeps us from having to perform
// the operations locally on the client-side.
// ========================================================

// ========================================================
// OBJECTIVE: Find and return count of items:
// Below the .count() is used to aggregate data on the server-side
// ========================================================
// db.collection('users').find({age: 27}).count((err, count) => {
//   console.log(count) // => 3
// })
// ========================================================

// ========================================================
// OBJECTIVE: find task by ID
// ========================================================
// db.collection('tasks').findOne(
//   { _id: new ObjectID("600b7d493b01d064b2e52160") }, (err, task) => {
//   !err ? console.log(task) : console.log("Unable to fetch task");
//   /* =>
//       {
//         _id: 600b7d493b01d064b2e52160,
//         description: 'Task 3',
//         completed: false
//       }
//   */
// })
// ========================================================

// ========================================================
// OBJECTIVE: find and list all incomplete tasks
// ========================================================
// db.collection('tasks').find({completed: false}).toArray((err, tasks) => {
//   !err ? console.log(tasks) : console.log("Unable to fetch tasks");
//   /* =>
//       [
//         {
//           _id: 600b7d493b01d064b2e5215f,
//           description: 'Task 2',
//           completed: false
//         },
//         {
//           _id: 600b7d493b01d064b2e52160,
//           description: 'Task 3',
//           completed: false
//         }
//       ]
//   */
// })
// ========================================================

// ========================================================
// OBJECTIVE:  Update Document
// ========================================================
// db.collection("users")
//   .updateOne(
//     { _id: new ObjectID("600b7a8a3b01d064b2e52158") }, // find by id
//     {
//       // $set - is a document operator to help perform data mutations such as updating
//       $set: {
//         name: "Mike",
//       },
//       // $inc - is a document operator used to increment and decrement values
//       $inc: {
//         age: 1, // will reduce the age of the user by -1
//       },
//     }
//   )
//   .then((result) => console.log(result))
//   .catch((e) => console.log("Err!", e));
// ========================================================
