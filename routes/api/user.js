const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middlewares/auth");

const router = express.Router();

// importing models
const User = require("../../models/User");

router.use(express.json());

const generateError = (res, status, msg) => {
  return res.status(status).json({ msg });
};

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) generateError(res, 400, "User does not exist");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) generateError(res, 401, "Wrong password");
  jwt.sign({ id: user.id }, config.get("jwtSecret"), (err, token) => {
    if (err) generateError(res, 400, "server error, try again later");
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  });
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const newUser = new User({
    name,
    email,
    password
  });
  const userExists = await User.findOne({ email });
  if (userExists) generateError(res, 406, "User already exists");
  bcrypt.genSalt(10, async (err, salt) => {
    if (err) generateError(res, 400, "server error, try again later");
    const hashedPassword = await bcrypt.hash(newUser.password, salt);
    newUser.password = hashedPassword;
    const savedUser = await newUser.save();
    jwt.sign({ id: savedUser.id }, config.get("jwtSecret"), (err, token) => {
      if (err) generateError(res, 400, "server error, try again later");
      res.json({
        token,
        user: {
          id: savedUser.id,
          name: savedUser.name,
          email: savedUser.email
        }
      });
    });
  });
});

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) generateError(res, 401, "Unauthorized");
  res.json({ user });
});

module.exports = router;
