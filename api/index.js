import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

dotenv.config();
mongoose
  .connect(
    process.env.DB_URL
  )
  .then(() => {
    console.log("DB connected");
  }).catch((err)=>{
    console.error(err);
  });

const app = express();

app.listen(5500, () => {
  console.log("Server is running on port 5500");
});