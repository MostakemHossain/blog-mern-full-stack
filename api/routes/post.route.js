import express from "express";
import { create, deletePost, getPosts } from "../controller/post.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router= express.Router();

router.post('/create',verifyToken,create);
router.get('/getPosts',getPosts);
router.delete('/deletepost/:postId/:userId',verifyToken,deletePost);

export default router;