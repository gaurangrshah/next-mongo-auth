import User from "@/models/user";

export const getUser = async (id) => {
  return await User.findById(id)
  .then((user) => user)
  .catch((e) => new Error(e));
  /**
   * @param {string}    id          user id as a string
   */
};

export const updateUser = async (id, updates = {}) => {
  const arrUpdates = Object.keys(updates); // convert to an array of key names
  const user = await User.findById(id); // get matching user from db
  // use all update keys to set the correct property and value on user object
  arrUpdates.forEach((update) => (user[update] = updates[update]));

  // defaults for properties currently required by validation
  if (!user.password) user.password = "undefined";
  if (!user.username) user.username = user.name;

  // try {
  console.log("-------saving------");
  const savedUser = await user
    .save() // user's password is hashed on each save, as a middleware operation
    .catch((e) => console.log(e));

  if (!savedUser) return new Error("could not update user");
  return Promise.resolve(savedUser);
  /**
   * @param   {string}    id            user id as a string
   * @param   {object}    updates       object containing any fields being updated
   * @returns {object}    updated user object`
   */
};

export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id)
  .then((user) => user)
  .catch((e) => new Error(e));
  /**
   * @param {string}    id          user id as a string
   */
};

export const getUsers = async () => {
  return await User.find({})
    .select("-__v")
    .then((users) => users)
    .catch((e) => new Error(e));
};

export const deleteAllUsers = async () => await User.deleteMany().exec();
