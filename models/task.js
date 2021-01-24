const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  description: {
    type: String,
    trim: true,
    required: true
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
