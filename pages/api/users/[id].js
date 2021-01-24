import nc from "next-connect";
import dbConnect from "@/utils/mongoose";
import User from "@/models/user";

const dummyUser = {
  name: "Steve Dummy",
  age: "27",
};

const getUser = async (id) => {
  return await User.findById(id)
    .then((user) => user)
    .catch((e) => new Error(e));
};

const updateUser = async (id, updates = {}) => {
  return await User.findByIdAndUpdate(id, updates)
    .then((user) => user)
    .catch((e) => new Error(e));
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id)
    .then((user) => user)
    .catch((e) => new Error(e));
};

const handler = nc({ onNoMatch, onError })
  .use(async (req, res, next) => {
    console.log("---middleware---");
    await dbConnect();
    next();
  })
  .get(async (req, res) => {
    res.json({ user: await getUser(req.query.id) });
  })
  .put(async (req, res) => {
    res.json({ user: await updateUser(req.query.id, req.body) });
  })
  .delete(async (req, res) => {
    res.json({ user: await deleteUser(req.query.id) });
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
