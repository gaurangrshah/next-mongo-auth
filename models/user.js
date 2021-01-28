const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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

UserSchema.statics.findByEmail = async function (email) {
  console.log("🔵 finding user by credentials");
  const currentUser = this;
  const user = await currentUser.findOne({ email }).exec();

  if (!user) {
    console.log('findbycredentials: user does not exist')
    return false;
  }
  return user;
};

// this pre method runs as middleware before each save
UserSchema.pre("save", async function (next) {
  console.log("-------runnin presave => hash pw + default image-------");
  const user = this;
  // check to see if password is being modified
  if (user.isModified("password")) {
    // hash password if modified
    console.log("----hashing user password----")
    user.password = await user.simpleHashPassword(user.password);
  }

  // add default user image if not already added
  if (!user.image) {
    console.log('----default user image----')
    user.image = `https://www.avatarapi.com/js.aspx?email=${user.email}&size=128"`;
  }
  console.log("pre save completed => user defaults applied");
  next();
});

UserSchema.methods.validPassword = function (password) {
  console.log("------validPassword------");
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.simpleHashPassword = async function (password) {
  return await bcrypt.hash(password, 8);
};

UserSchema.methods.hashPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
