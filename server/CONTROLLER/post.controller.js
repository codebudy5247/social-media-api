const Post = require("../MODEL/Post.js");

//TODO: Get Post by User ID
//TODO: Saved and Usaved post

const getPagination = (page, size) => {
  const limit = size ? +size : 8;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

exports.createPost = async (req, res) => {
  const post = req.body;
  const newPost = new Post({ ...post, user: req.user });
  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.getPosts = (req, res) => {
  const { page, size, title } = req.query;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  const { limit, offset } = getPagination(page, size);

  Post.paginate(condition, { offset, limit })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        posts: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch(() => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving posts.",
      });
    });
};

//get post by id 
exports.getPostById = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};


exports.updatePost = async (req,res) => {
  try {
    const { postBody, images } = req.body;
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id },
      {
        postBody,
        images,
      }
    );
    res.json({
      msg: "Updated Post!",
      newPost: {
        ...post._doc,
        postBody,
        images,
      },
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};


exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    res.json({
      msg: "Deleted Post!",
      post: post,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};


exports.likePost = async (req, res) => {
  try {
    const post = await Post.find({ _id: req.params.id, likes: req.user._id });
    if (post.length > 0)
      return res.status(400).json({ msg: "You liked this post." });

    const like = await Post.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    );

    if (!like)
      return res.status(400).json({ msg: "This post does not exist." });

    res.json({ msg: "Liked Post!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.unLikePost = async (req, res) => {
  try {
    const post = await Post.find({ _id: req.params.id, likes: req.user._id });
    if (post.length === 0)
      return res.status(400).json({ msg: "You did not like this post." });

    const unlike = await Post.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );

    if (!unlike)
      return res.status(400).json({ msg: "This post does not exist." });

    res.json({ msg: "Unliked Post!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

