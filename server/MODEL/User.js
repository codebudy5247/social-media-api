const mongoose = require("mongoose");
var faker = require("faker");

const UserSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      default:faker.internet.userName()
    },
    Age: {
      type: Number,
      required: true,
    },
    Location: {
      type: String,
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
    PhoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default: faker.image.avatar(),
    },
    story: {
      type: String,
      default: "",
      maxlength: 200,
    },
    website: { type: String, default: "", required: true },
    Role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },
    followers: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    following: [{type: mongoose.Types.ObjectId, ref: 'User'}],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
