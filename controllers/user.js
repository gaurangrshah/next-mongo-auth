import User from "@/models/user";
import TC from "@/utils/trycatch";

const dummyUser = {
  name: "Steve Dummy",
  age: "27",
};

export const getUser = async (id) => {
  /**
   * @param {string}    id          user id as a string
   */
  return await User.findById(id)
    .then((user) => user)
    .catch((e) => new Error(e));
};

export const updateUser = async (id, updates = {}) => {
  /**
   * @param {string}    id            user id as a string
   * @param {object}    updates       object containing any fields being updated
   */

  const arrUpdates = Object.keys(updates); // convert to an array of key names
  const user = await User.findById(id); // get matching user from db
  // use all update keys to set the correct property and value on user object
  arrUpdates.forEach((update) => (user[update] = updates[update]));

  // defaults for properties currently required by validation
  if (!user.password) user.password = "undefined";
  if (!user.username) user.username = user.name;

  // try {
    console.log('-------saving------')
    const savedUser = await user
      .save() // user's password is hashed on each save, as a middleware operation
      .catch((e) => console.log(e));

    if (!savedUser) return new Error("could not update user");
    return Promise.resolve(savedUser);
  // } catch (e) {
  //   console.log("err!", e);
  // }
  // .then((user) => console.log("user saved", user))
  // .catch((e) => console.log(e));

  // ❌ replaced findByIdAndUpdate with the above, in order to allow the pre(method)
  // to run as middleware on save

  // return await User.findByIdAndUpdate(id, updates, {
  //   new: true, // returns newly updated user rather than the original db instance
  //   runValidators: true, // runs validation on the updated data
  // })
  //   .then((user) => user)
  //   .catch((e) => new Error(e));
};

export const deleteUser = async (id) => {
  /**
   * @param {string}    id          user id as a string
   */
  return await User.findByIdAndDelete(id)
    .then((user) => user)
    .catch((e) => new Error(e));
};

export const createUser = async (req) => {
  const created = await TC(() => {
    return new User(req.body.name ? { ...req.body } : dummyUser)
      .save()
      .catch((e) => new Error(e));
  });
  if(!created) return new Error('could not be created')
  console.log("created", created);
  return Promise.resolve(created);
};

export const getUsers = async () => {
  return await User.find({})
    .select("-__v")
    .then((users) => users)
    .catch((e) => new Error(e));
};

export const deleteAllUsers = async () => await User.deleteMany().exec();
