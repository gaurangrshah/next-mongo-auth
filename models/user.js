const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minLength: [6, "Sorry must be longer than 6 chars"],
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Email is invalid");
    },
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "Sorry password must be longer than 6 chars"],
    validate(value) {
      if (value && value.toLowerCase().includes("password"))
        throw new Error("password cannot be 'password'");
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) throw new Error("Age must be a positive number");
    },
  },
});



export default mongoose.models.User || mongoose.model("User", UserSchema);
