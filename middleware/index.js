import nextConnect from "next-connect";
import db from "./db";
import morgan from "morgan"

const middleware = nextConnect();

middleware.use(morgan('tiny'));
middleware.use(db);

export default middleware;
