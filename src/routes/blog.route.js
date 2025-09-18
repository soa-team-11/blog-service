import express from "express";
import { create, getAll, likeOrUnlike, postComment } from "../controllers/blog.controller.js";

const router = express.Router();

router.get("/", getAll);
router.post("/", create);
router.patch("/comment", postComment);
router.patch("/like", likeOrUnlike);

export default router;