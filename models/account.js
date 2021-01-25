const {models, model, Schema, Types} = require("mongoose");


const AccountSchema = new Schema(
  {
    compoundId: {
      type: Types.ObjectId,
      required: true,
      unique: true,
    },
    userId: {
      type: Number,
      index: true,
    },
    providerType: String,
    providerId: {
      type: String,
      index: true,
    },
    providerAccountId: {
      type: String,
      index: true,
    },
    refreshToken: String,
    accessToken: String,
    accessTokenExpires: Date,
  },
  { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } }
);

export default models.Account ||
  model("Account", AccountSchema);
