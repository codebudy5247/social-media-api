const User = require("../MODEL/User");

exports.getUser = async (req, res) => {
  try {
    // const user = await User.findById(req.params.id);
    const user = req.user
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    res.json({ user });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// exports.followUser = async (req, res) => {
//   try {
//     const user = await User.find({
//       _id: req.params.id,
//       followers: req.user._id,
//     });
//     if (user.length > 0)
//       return res.status(500).json({ msg: "You followed this user." });

//     const newUser = await User.findOneAndUpdate(
//       { _id: req.params.id },
//       {
//         $push: { followers: req.user._id },
//       },
//       { new: true }
//     ).populate("followers following", "-password");

//     await User.findOneAndUpdate(
//       { _id: req.user._id },
//       {
//         $push: { following: req.params.id },
//       },
//       { new: true }
//     );

//     res.json({ newUser });
//   } catch (err) {
//     return res.status(500).json({ msg: err.message });
//   }
// };

exports.followUser = async (req, res) => { 
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    const newUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { followers: req.user._id },
      },
      { new: true }
    ).populate("followers following", "-password");

    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: { following: req.params.id },
      },
      { new: true }
    );

    res.json({ newUser });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

exports.unFollowUser = async (req, res) => {
  try {
    const user = await User.find({
      _id: req.params.id,
      followers: req.user._id,
    });
    if (user.length === 0)
      return res.status(400).json({ msg: "You did not follow this user." });

    const newUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: { followers: req.user._id },
      },
      { new: true }
    ).populate("followers following", "-password");

    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $pull: { following: req.params.id },
      },
      { new: true }
    );

    res.json({ newUser });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}