import nc from "next-connect";
import dbConnect from "@/utils/mongoose";
import Task from "@/models/task";

const dummyTask = {
  description: "Talk 3",
};

const createTask = async (req) => {
  const created = await new Task(
    req.body.description ? { ...req.body } : dummyTask
  )
    .save()
    .then((createdTask) => createdTask)
    .catch((e) => console.log(e));

  return created;
};

const getTasks = async () => {
  return await Task.find({})
    .then((task) => task)
    .catch((e) => console.log("err!", e));
};


const deleteAllTasks = async () => await Task.deleteMany().exec()
// const deleteTasks = async () => {
//   return await Task.deleteMany({})
//     .then((task) => {
//       console.log("removed", task);
//       return Task.countDocuments({});
//     })
//     .then((count) => count)
//     .catch((e) => console.log("err!", e));
// };

const handler = nc({ onNoMatch, onError })
  .use(async (req, res, next) => {
    console.log("---middleware---");
    await dbConnect();
    next();
  })
  .get(async (req, res) => {
    res.json({ task: await getTasks() });
  })
  .post(async (req, res) => {
    res.json({ success: "ok", task: await createTask(req) });
  })
  .delete(async (req, res) => {
    res.json({ task: await deleteAllTasks() });
  });

export default handler;

function onNoMatch(req, res) {
  res.status(404).end("page is not found... or is it");
}

function onError(err, req, res, next) {
  console.log(err);

  res.status(500).end(err.toString());
  // OR: you may want to continue
  next();
}
