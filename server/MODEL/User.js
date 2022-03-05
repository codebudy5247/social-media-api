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
      default: "https://mui.com/static/images/avatar/2.jpg",
    },
    story: {
      type: String,
      default: "",
      maxlength: 200,
    },
    bio:{
      type: String,
      required: true,
    },
    Role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },
    // instaLink:{
    //   type: String,
    //   required: true,
    // },
    // twitterLink:{
    //   type: String,
    //   required: true,
    // },
    followers: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    following: [{type: mongoose.Types.ObjectId, ref: 'User'}],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
