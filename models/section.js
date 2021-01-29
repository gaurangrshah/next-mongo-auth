const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    order: Number,
    pages: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Page"
    },
    blocks: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Block"
    }
  }
);

export default mongoose.models.Section ||
  mongoose.model("Section", SectionSchema);
