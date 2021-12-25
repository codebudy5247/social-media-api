const Post = require("../MODEL/Post.js");

const getPagination = (page, size) => {
  const limit = size ? +size : 8;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

exports.createPost = async (req, res) => {
  const post = req.body
  const newPost = new Post({...post,user:req.user})
  try {
    await newPost.save()
    res.status(201).json(newPost)

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
        message:
          err.message || "Some error occurred while retrieving posts.",
      });
    });
};

