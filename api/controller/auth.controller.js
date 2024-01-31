import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const singup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "Please field all fields"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    res.json({
      message: "Sign up Successfull",
    });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "Please field all fields"));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
     return next(errorHandler(404, "Invalid Email or Password"));
    }
    const hashedPassword = bcryptjs.compareSync(password, validUser.password);
    if (!hashedPassword) {
     return next(errorHandler(400, "Invalid Email or Password"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SERECT);
    const {password:pass,...rest}=validUser._doc
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);

     
  } catch (err) {
    next(err);
  }
};
