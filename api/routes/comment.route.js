import express from "express";
import { createComment, deleteComment, editComment, getPostComments, likeComment } from "../controller/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router= express.Router();

router.post('/create',verifyToken,createComment);
router.get('/get-posts-comment/:postId',getPostComments);
router.put('/like-comment/:commentId',verifyToken,likeComment);
router.put('/edit-comment/:commentId',verifyToken,editComment);
router.delete('/delete-comment/:commentId',verifyToken,deleteComment);
export default router;