import nc from "next-connect";
import middleware from "@/middleware/index";
import TC from "@/utils/trycatch";
import { createTask, getTasks, deleteAllTasks } from "@/controllers/task";
import { onNoMatch, onError } from '@/utils/handlers';

const handler = nc({ onNoMatch, onError })
  .use(middleware) // currently only database in middleware
  .get(async (req, res) => {
    res.json({ task: await TC(() => getTasks()) });
  })
  .post(async (req, res) => {
    res.json({ success: "ok", task: await TC(() => createTask(req)) });
  })
  .delete(async (req, res) => {
    res.json({ task: await TC(() => deleteAllTasks()) });
  });

export default handler;

