import { connectToDatabase } from "@/utils/mongodb";

export function database() {
  return async (req, res, next) => {
    const { db } = await connectToDatabase();
    req.db = db
    next();
  };
}
