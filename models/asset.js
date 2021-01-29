const mongoose = require("mongoose");

const AssetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  kind: {
    type: String,
    required: true,
  },
  altText: String,
  description: String,
  url: String,
  blocks: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Block",
  },
});

export default mongoose.models.Asset || mongoose.model("Asset", AssetSchema);
