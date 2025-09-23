import express from "express";
import { likeOrUnlike } from "../controllers/blog.controller.js";

const router = express.Router();

router.patch("/like", likeOrUnlike);

export default router;