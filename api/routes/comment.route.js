import express from "express";
import { createComment, getPostComments, likeComment } from "../controller/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router= express.Router();

router.post('/create',verifyToken,createComment);
router.get('/get-posts-comment/:postId',getPostComments);
router.put('/like-comment/:commentId',verifyToken,likeComment);
export default router;