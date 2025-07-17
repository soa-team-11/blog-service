import express from "express";
import { create, likeOrUnlike, postComment } from "../controllers/blog.controller.js";

const router = express.Router();

router.post("/", create);
router.patch("/comment", postComment);
router.patch("/like", likeOrUnlike);

export default router;