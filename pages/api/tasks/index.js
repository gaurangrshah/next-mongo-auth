import nc from "next-connect";
import dbConnect from "@/utils/mongoose";
import Task from "@/models/task";

const dummyTask = {
  name: "Talk 3",
};


const getTasks = async () => {
  return await Task.find({})
    .then((task) => task)
    .catch((e) => console.log("err!", e));
};

const deleteTasks = async (id) => {
  return await Task.deleteMany({})
    .then((task) => {
      return Task.countDocuments({});
    })
    .then((count) => count)
    .catch((e) => console.log("err!", e));
};

const handler = nc({ onNoMatch, onError })
  .use(async (req, res, next) => {
    console.log("---middleware---");
    await dbConnect();
    next();
  })
  .get(async (req, res) => {
    res.json({ task: await getTasks() });
  })
  .delete(async (req, res) => {
    res.json({ task: await deleteTasks() });
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
