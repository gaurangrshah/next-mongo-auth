import nc from "next-connect";
import middleware from "@/middleware/index";
import TC from "@/utils/trycatch";
import { getTask, updateTask, deleteTask } from "@/controllers/task";
import { onNoMatch, onError } from "@/utils/handlers";
import { isValidOperation } from "@/utils/validate-update";

const handler = nc({ onNoMatch, onError })
  .use(middleware)
  .get(async (req, res) => {
    res.json({ task: await TC(() => getTask(req.query.id)) });
  })
  .put(async (req, res) => {
    if (!isValidOperation("task", req.body)) {
      return res.status(400).send({ error: "Invalid Updates!" });
    }
    res.json({ task: await TC(() => updateTask(req.query.id, req.body)) });
  })
  .delete(async (req, res) => {
    res.json({ task: await TC(() => deleteTask(req.query.id)) });
  });

export default handler;
