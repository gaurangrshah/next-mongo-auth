const mongoose = require("mongoose");

const BlockSchema = new mongoose.Schema({
  kind: {
    type: String,
    required: true,
  },
  lead: String,
  title: {
    type: String,
    required: true,
  },
  excerpt: String,
  content: String,
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Asset",
  },
});

export default mongoose.models.Block || mongoose.model("Block", BlockSchema);
