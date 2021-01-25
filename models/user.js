const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
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
    emailVerified: {
      type: Date,
    },
    image: {
      type: String,
      trim: true,
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
  },
  { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } }
);


// UserSchema.methods.validPassword = function (password) {
//   return bcrypt.compareSync(password, this.password);
// };

// UserSchema.methods.hashPassword = function (password) {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
// };



export default mongoose.models.User || mongoose.model("User", UserSchema);
