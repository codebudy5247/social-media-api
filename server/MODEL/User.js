const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      // default:faker.internet.userName()
      required: true,
    },
    Age: {
      type: Number,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Email_id: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default: "https://mui.com/static/images/avatar/2.jpg",
      required: true,
    },
    bio:{
      type: String,
      required: true,
    },
    Role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      default: "user",
    },
    followers: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    following: [{type: mongoose.Types.ObjectId, ref: 'User'}],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
