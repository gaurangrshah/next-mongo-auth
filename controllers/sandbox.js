export async function getTasks(db, query) {
  return await db.collection("tasks").find(query).toArray();
}
