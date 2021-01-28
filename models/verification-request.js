const mongoose = require("mongoose");

const VerificationRequestsSchema = new mongoose.Schema(
  {
    identifier: String,
    token: {
      type: String,
      unique: true
    },
    expires: Date
  },
  { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } }
);

export default mongoose.models.VerificationRequest ||
  mongoose.model("VerificationRequest", VerificationRequestsSchema);
