import nc from "next-connect";
import dbConnect from "@/utils/mongoose";
import User from "@/models/user";

const dummyUser = {
  name: "Steve Dummy",
  age: "27",
};

const createUser = async (req) => {
  const created = await new User(req.body.name ? { ...req.body } : dummyUser)
    .save()
    .then((createdUser) => createdUser)
    .catch((e) => console.log(e));

  return created;
};

const getUsers = async () => {
  return await User.find({})
    .select("-__v")
    .then((users) => users)
    .catch((e) => e);
};


const deleteAllUsers = async () => await User.deleteMany().exec();

const handler = nc({ onNoMatch, onError })
  .use(async (req, res, next) => {
    console.log("---middleware---");
    await dbConnect();
    next();
  })
  .get(async (req, res) => {
    res.json({ success: "ok", users: await getUsers() });
  })
  .post(async (req, res) => {
    res.json({ success: "ok", user: await createUser(req) });
  })
  .delete(async (req, res) => {
    await deleteAllUsers();
    res.json({ success: "ok" });
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
