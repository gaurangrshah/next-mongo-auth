import nc from "next-connect";
import middleware from "@/middleware/index";
import TC from "@/utils/trycatch";
import { createUser, getUsers, deleteAllUsers } from "@/controllers/user";
import { onNoMatch, onError } from "@/utils/handlers";
import { registerUser } from "@/utils/auth";

const handler = nc({ onNoMatch, onError })
  .use(middleware)
  .get(async (req, res) => {
    res.json({ success: "ok", users: await TC(() => getUsers()) });
  })
  .post(async (req, res) => {
    const user = await registerUser(req.body);
    !user && res.status(400).json({ error: "error creating user" });
    user &&
      res.redirect(200, "/auth/signin?callbackUrl=http://localhost:3000/");
  })
  .delete(async (req, res) => {
    await TC(() => deleteAllUsers());
    res.json({ success: "ok" });
  });

export default handler;
