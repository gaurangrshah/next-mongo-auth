import nc from "next-connect";
import middleware from "@/middleware/index";
import TC from "@/utils/trycatch";
import { getUser, updateUser, deleteUser } from "@/controllers/user";
import { onNoMatch, onError } from "@/utils/handlers";
import { isValidOperation } from "@/utils/validate-update";

const handler = nc({ onNoMatch, onError })
  .use(middleware)
  .get(async (req, res) => {
    res.json({ user: await TC(() => getUser(req.query.id)) });
  })
  .put(async (req, res) => {
    if (!isValidOperation("user", req.body)) { // make sure fields are allowed to be updated
      // handle errors
      return res.status(400).send({ error: "Invalid Updates!" });
    }
    // handle success
    res.json({ user: await TC(() => updateUser(req.query.id, req.body)) });
  })
  .delete(async (req, res) => {
    res.json({ user: await TC(() => deleteUser(req.query.id)) });
  });

export default handler;
