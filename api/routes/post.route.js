import express from "express";
import { create } from "../controller/post.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router= express.Router();

router.post('/create',verifyToken,create);

export default router;