import Models from "@/models";


export const mongoConfig = {
  type: "mongodb",
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  url: `${process.env.MONGODB_URL}/next-studio`,
  customModels: {
    User: Models.User,
    Account: Models.Account,
    Session: Models.Session,
    Asset: Models.Asset,
    Block: Models.Block,
    Page: Models.Page,
    Section: Models.Section,
    // VerificationRequest: Models.VerificationRequest,
  },
};
