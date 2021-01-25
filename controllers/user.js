import User from "@/models/user";

const dummyUser = {
  name: "Steve Dummy",
  age: "27",
};

export const getUser = async (id) => {
  return await User.findById(id)
    .then((user) => user)
    .catch((e) => new Error(e));
};

export const updateUser = async (id, updates = {}) => {
  return await User.findByIdAndUpdate(id, updates, {
    new: true, // returns newly updated user rather than the original db instance
    runValidators: true, // runs validation on the updated data
  })
    .then((user) => user)
    .catch((e) => new Error(e));
};

export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id)
    .then((user) => user)
    .catch((e) => new Error(e));
};

export const createUser = async (req) => {
  const created = await new User(req.body.name ? { ...req.body } : dummyUser)
    .save()
    .then((createdUser) => createdUser)
    .catch((e) => new Error(e));

  return created;
};

export const getUsers = async () => {
  return await User.find({})
    .select("-__v")
    .then((users) => users)
    .catch((e) => new Error(e));
};

export const deleteAllUsers = async () => await User.deleteMany().exec();
