const bcrypt = require("bcryptjs");
const User = require("../Models/userModel");

exports.signup = async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: "Please enter all required fields" });
  }

  const nameValidator = /^[A-Za-z ]{3,20}$/;
  const emailValidator =
    /^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const passwordValidator =
    /^(?=.*[0-9])(?=.*[a-zA-Z ])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&* ]{8,20}$/;

  if (!nameValidator.test(name)) {
    return res.status(400).json({
      error:
        "Name should have at least 3 characters and should not any number!",
    });
  }
  if (!emailValidator.test(email)) {
    return res.status(400).json({ error: "Invalid Email" });
  }
  if (!passwordValidator.test(password)) {
    return res.status(400).json({
      error:
        "Password must contain at least 8 characters, 1 number, 1 upper, 1 lowercase and 1 special character!",
    });
  }

  try {
    const eamilExist = await User.findOne({ email });

    if (eamilExist) {
      res.status(400).json({ error: "User already exists" });
    } else {
      const user = new User({
        name,
        email,
        password,
        pic,
      });
      await user.save();
      const token = await user.generateToken();
      return res
        .status(200)
        .json({ success: true, token, msg: "User Registered Successfully" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Please fill all required fields" });
  }
  try {
    const checkEmail = await User.findOne({ email });
    if (!checkEmail) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, checkEmail.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }
    const token = await checkEmail.generateToken();
    return res.status(200).json({ success: true, token });
  } catch (e) {
    console.error(e.message);
    return res.status(500).send("Server Error");
  }
};

exports.getUser = (req, res) => {
  return res.send(req.user);
};

exports.getUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
};
