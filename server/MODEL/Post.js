const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const postSchema = new mongoose.Schema(
  {
    postBody: String,
    images: {
      type: String,
      required: true,
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    // comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
    user:Object
  },
  {
    timestamps: true,
  }
);

postSchema.method("toJSON", function() {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

postSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("post", postSchema);
