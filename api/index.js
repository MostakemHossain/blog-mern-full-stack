import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import AuthRoutes from './routes/auth.route.js';
import CommentRoutes from "./routes/comment.route.js";
import PostRoutes from "./routes/post.route.js";
import UserRoutes from "./routes/user.route.js";

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
app.use(express.json());
app.use(cookieParser())

app.listen(5500, () => {
  console.log("Server is running on port 5500");
});

app.use('/api/user',UserRoutes);
app.use('/api/auth',AuthRoutes);
app.use('/api/post',PostRoutes);
app.use('/api/comment',CommentRoutes);


app.use((err,req,res,next)=>{
  const statusCode= err.statusCode || 500;
  const message= err.message||'Internal Server Error';
  res.status(statusCode).json({
    success:false,
    statusCode,
    message,
  })
})

