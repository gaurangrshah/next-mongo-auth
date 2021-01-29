import nc from "next-connect";
import middleware from "@/middleware/index";
// import TC from "@/utils/trycatch";
import { getUser, updateUser, deleteUser } from "@/controllers/user";
import { onNoMatch, onError } from "@/utils/handlers";
import { isValidOperation } from "@/utils/validate-update";

const handler = nc({ onNoMatch, onError })
  .use(middleware)
  .get(async (req, res) => {
    res.json({
      user: await getUser(req.query.id).catch((e) =>
        console.log("Get Err", e)
      ),
    });
  })
  .put(async (req, res) => {
    // make sure fields are allowed to be updated
    if (!isValidOperation("user", req.body)) {
      // handle errors
      return res.status(400).send({ error: "Invalid Updates!" });
    }
    // handle success
    res.json({
      user: await updateUser(req.query.id, req.body).catch((e) =>
        console.log("Updating Err", e)
      ),
    });
  })
  .delete(async (req, res) => {
    res.json({
      user: await deleteUser(req.query.id).catch((e) =>
        console.log("Delete Err", e)
      ),
    });
  });

export default handler;
