export async function getIncompleteTasks(db) {
  return await db
    .collection("tasks")
    .find({ completed: false })
    .toArray()
    .then((tasks) => tasks)
    .catch((err) => console.log("err", err));
}

export async function markAllTasksComplete(db) {
  return await db
    .collection("tasks")
    .updateMany({ completed: false }, { $set: { completed: true } });
}

export async function markAllTasksIncomplete(db) {
  return await db
    .collection("tasks")
    .updateMany({ completed: true }, { $set: { completed: false } });
}

export async function createUsers(db) {
  return await db.collection("users").insertMany([
    { name: "Jim", age: 27 },
    { name: "Joe", age: 27 },
    { name: "Susan", age: 27 },
  ]);
}

export async function deleteUsers(db) {
  return await db.collection("users").deleteMany({ age: 27 });
}

export async function deleteTask(db, id) {
  return await db.collection("task").deleteOne({ description: "Task 1" });
    // .then((result) => result)
    // .catch((e) => console.log("err", e));
}
