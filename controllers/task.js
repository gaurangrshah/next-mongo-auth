import Task from "@/models/task";

const dummyTask = {
  description: "Talk 3",
};

export const createTask = async (req) => {
  const created = await new Task(
    req.body.description ? { ...req.body } : dummyTask
  )
    .save()
    .then((createdTask) => createdTask)
    .catch((e) => new Error(e));

  return created;
};

export const getTasks = async () => {
  return await Task.find({})
    .then((task) => task)
    .catch((e) => new Error(e));
};

export const deleteAllTasks = async () =>
  await Task.deleteMany()
    .exec()
    .then((result) => result)
    .catch((e) => new Error(e));

export const getTask = async (id) => {
  return await Task.findById(id)
    .then((task) => task)
    .catch((e) => new Error(e));
};

export const updateTask = async (id, updates = {}) => {
  return await Task.findByIdAndUpdate(id, updates, {
    new: true, // returns newly updated user rather than the original db instance
    runValidators: true, // runs validation on the updated data
  })
    .then((task) => task)
    .catch((e) => new Error(e));
};

export const deleteTask = async (id) => {
  return await Task.findByIdAndDelete(id)
    .then((task) => task)
    .catch((e) => new Error(e));
};

// export const deleteTasks = async () => {
//   return await Task.deleteMany({})
//     .then((task) => {
//       console.log("removed", task);
//       return Task.countDocuments({});
//     })
//     .then((count) => count)
//     .catch((e) => console.log("err!", e));
// };
