import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const singup = async (req, res) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const hashedPassword= bcryptjs.hashSync(password,10);

  const newUser = new User({
    username,
    email,
    password:hashedPassword,
  });
  try{
    await newUser.save();
  res.json({
    message: "Sign up Successfull",
  });
  }catch(err){
    return res.status(500).json({ message:err.message });
  }
};
