import express from "express";
import { create, deletePost, getPosts, updatepost } from "../controller/post.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router= express.Router();

router.post('/create',verifyToken,create);
router.get('/getposts',getPosts);
router.delete('/deletepost/:postId/:userId',verifyToken,deletePost);
router.put('/updatepost/:postId/:userId', verifyToken, updatepost)

export default router;