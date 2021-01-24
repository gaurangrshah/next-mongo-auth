const { ObjectID } = require("mongodb");
import nc from "next-connect";
import { database } from "@/middleware/database";

import {
  createUsers,
  deleteUsers,
  // getIncompleteTasks,
  markAllTasksComplete,
  markAllTasksIncomplete,
  deleteTask,
} from "@/controllers/hello";

import { getTasks } from "@/controllers/sandbox";

const handler = nc()
  .use((req, res, next) => {
    console.log("----loaded middleware----");
    next();
  })
  .use(database()) // connect to database
  .use((req, res, next) => {
    req.test = "this is a test string";
    next();
  })
  .get(
    async (req, res) => res.json(await getTasks(req.db, { completed: false }))

    // async (req, res) => res.json({ users: await createUsers(req.db) })
    // res.json({ tasks: await getIncompleteTasks(req.db), test: req.test })
  )
  .post(async (req, res) => res.json(await markAllTasksIncomplete(req.db)))
  .put(async (req, res) => res.end("async/await is also supported!"))
  .patch(async (req, res) => {
    throw new Error("Throws me around! Error can be caught and handled.");
  })
  .delete(async (req, res) => res.json(await deleteTask(req.db)));

export default handler;

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// export default (req, res) => {
//   res.statusCode = 200
//   res.json({ name: 'John Doe' })
// }
