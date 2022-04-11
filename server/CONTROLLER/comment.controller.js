const Post = require("../MODEL/Post.js");
const Comment = require("../MODEL/Comment.js");

//Create comment
exports.createComment = async (req, res) => {
  try {
    const { postId, content, tag, reply, postUserId } = req.body;

    const post = await Post.findById(postId);
    if (!post)
      return res.status(400).json({ msg: "This post does not exist." });

    if (reply) {
      const cm = await Comment.findById(reply);
      if (!cm)
        return res.status(400).json({ msg: "This comment does not exist." });
    }

    const newComment = new Comment({
      user: req.user._id,
      content,
      tag,
      reply,
      postUserId,
      postId,
    });

    await Post.findOneAndUpdate(
      { _id: postId },
      {
        $push: { comments: newComment },
      },
      { new: true }
    );

    await newComment.save();

    res.json({ newComment });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment)
      return res.status(400).json({ msg: "This comment does not exist." });

    if (comment.user.toString() !== req.user._id.toString())
      return res
        .status(400)
        .json({ msg: "You are not the owner of this comment." });

    await Comment.findByIdAndRemove(commentId);

    await Post.findOneAndUpdate(
      { _id: comment.postId },
      {
        $pull: { comments: commentId },
      },
      { new: true }
    );

    res.json({ msg: "Comment deleted successfully." });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//update comment
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content, tag } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment)
      return res.status(400).json({ msg: "This comment does not exist." });

    if (comment.user.toString() !== req.user._id.toString())
      return res
        .status(400)
        .json({ msg: "You are not the owner of this comment." });

    await Comment.findByIdAndUpdate(commentId, {
      content,
      tag,
    });

    res.json({ msg: "Comment updated successfully." });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//like comment
exports.likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment)
      return res.status(400).json({ msg: "This comment does not exist." });

    if (comment.likes.includes(req.user._id))
      return res.status(400).json({ msg: "You already liked this comment." });

    await Comment.findByIdAndUpdate(commentId, {
      $push: { likes: req.user._id },
    });

    res.json({ msg: "Comment liked successfully." });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//unlike comment
exports.unlikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment)
      return res.status(400).json({ msg: "This comment does not exist." });

    if (!comment.likes.includes(req.user._id))
      return res.status(400).json({ msg: "You did not like this comment." });

    await Comment.findByIdAndUpdate(commentId, {
      $pull: { likes: req.user._id },
    });

    res.json({ msg: "Comment unliked successfully." });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//get all comments
exports.getAllComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post)
      return res.status(400).json({ msg: "This post does not exist." });

    const comments = await Comment.find({ postId });

    res.json({ comments });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
