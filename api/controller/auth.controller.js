import User from "../models/user.model.js";
import { handleError } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(handleError(400, " All fields must be provided"));
  }
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newuser = new User({ username, email, password: hashedPassword });
  try {
    await newuser.save();
    res.status(200).json("user created successfully");
  } catch (error) {
    next(error);
  }
};
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    return next(handleError(400, "All fields must be provided"));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(handleError(401, "Wrong credentials!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(handleError(401, "Wrong credentials!"));
    const { password: pass, ...userInfo } = validUser._doc;
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ ...userInfo });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { name, email, googlePhotoURL } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (validUser) {
      const { password, ...userInfo } = validUser._doc;
      const token = jwt.sign({ id: userInfo._id }, process.env.JWT_SECRET);
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(userInfo);
    } else {
      const generatedpassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(26).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedpassword, 10);
      const newuser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoURL,
      });
      await newuser.save();
      const token = jwt.sign({ id: newuser._id }, process.env.JWT_SECRET);
      const { password, ...rest } = newuser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
