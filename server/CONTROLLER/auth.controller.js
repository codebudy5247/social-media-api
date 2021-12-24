const User = require("../MODEL/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Register User
exports.CreateUser = async (req, res) => {
  const { Name,username, Age, Location, PhoneNumber, Email_id, Password ,website} = req.body;
  try {
    const oldUser = await User.findOne({ Email_id });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(Password, 12);

    const result = await User.create({
      Name,
      username,
      Age,
      Location,
      PhoneNumber,
      Email_id,
      website,
      Password: hashedPassword,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id, Role: result.Role },
      process.env.JWT_SECRET,
      {
        expiresIn: "11h",
      }
    );

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

//Login User
exports.LoginUser = async (req, res) => {
  const { Email_id, Password } = req.body;
  try {
    const oldUser = await User.findOne({Email_id});

    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(Password, oldUser.Password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: oldUser.Email_id, id: oldUser._id, Role: oldUser.Role },
      process.env.JWT_SECRET,
      {
        expiresIn: "11h",
      }
    );

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

//Register Admin
exports.CreateAdmin = async(req,res)=>{
  const { Name, Age, Location, PhoneNumber, Email_id, Password } = req.body;
  try {
    const oldUser = await User.findOne({ Email_id });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(Password, 12);

    const result = await User.create({
      Name,
      Age,
      Location,
      PhoneNumber,
      Email_id,
      Password: hashedPassword,
      Role:"admin"
    });

    const token = jwt.sign(
      { email: result.email, id: result._id, Role: result.Role },
      process.env.JWT_SECRET,
      {
        expiresIn: "11h",
      }
    );

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
}
//Login Admin
exports.LoginAdmin = async(req,res)=>{
  const { Email_id, Password } = req.body;
  try {
    const oldUser = await User.findOne({Email_id});

    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(Password, oldUser.Password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: oldUser.Email_id, id: oldUser._id, Role: oldUser.Role },
      process.env.JWT_SECRET,
      {
        expiresIn: "11h",
      }
    );

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
}