import nc from "next-connect";
import dbConnect from "@/utils/mongoose";
import Task from "@/models/task";

const dummyTask = {
  description: "Dummy Todo",
};

const createTask = async (body) => {
  const created = await new Task(body)
    .save()
    .then((createdTask) => createdTask)
    .catch((e) => console.log(e));

  return created;
};


const getTask = async (id) => {
  return await Task.findById(id)
    .then((task) => task)
    .catch((e) => console.log("err!", e));
};

const updateTask = async (id, updates = {}) => {
  return await Task.findByIdAndUpdate(id, updates)
    .then((task) => task)
    .catch((e) => console.log("err!", e));
};

const deleteTask = async (id) => {
  return await Task.findByIdAndDelete(id)
    .then((task) => task)
    .catch((e) => console.log("err!", e));
};

const handler = nc({ onNoMatch, onError })
  .use(async (req, res, next) => {
    console.log("---middleware---");
    await dbConnect();
    next();
  })
  .get(async (req, res) => {
    res.json({ task: await getTask(req.query.id) });
  })
  .post(async (req, res) => {
    res.json({ task: await createTask(req.body) });
  })
  .put(async (req, res) => {
    res.json({ task: await updateTask(req.query.id, req.body) });
  })
  .delete(async (req, res) => {
    res.json({ task: await deleteTask(req.query.id) });
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
