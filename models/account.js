const mongoose = require("mongoose");
const ObjectId = mongoose.ObjectId;

const AccountSchema = new mongoose.Schema(
  {
    compoundId: {
      type: ObjectId,
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

export default mongoose.models.Account ||
  mongoose.model("Account", AccountSchema);
