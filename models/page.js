const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  prefix: String,
  slug: {
    type: String,
    required: true,
  },
  sections: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
  }
});

export default mongoose.models.Page ||
  mongoose.model("Page", PageSchema);
