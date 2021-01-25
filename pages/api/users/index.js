import nc from "next-connect";
import middleware from "@/middleware/index"
import TC from "@/utils/trycatch";
import { createUser, getUsers, deleteAllUsers } from "@/controllers/user";
import { onNoMatch, onError } from "@/utils/handlers";



const handler = nc({ onNoMatch, onError })
  .use(middleware)
  .get(async (req, res) => {
    res.json({ success: "ok", users: await TC(() => getUsers()) });
  })
  .post(async (req, res) => {
    res.json({ success: "ok", user: await TC(() => createUser(req) )});
  })
  .delete(async (req, res) => {
    await TC(() => deleteAllUsers());
    res.json({ success: "ok" });
  });

export default handler;
