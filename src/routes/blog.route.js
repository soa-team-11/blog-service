import express from "express";
import { create, getAll, likeOrUnlike } from "../controllers/blog.controller.js";

const router = express.Router();

router.get("/", getAll);
router.post("/", create);
router.patch("/like", likeOrUnlike);

export default router;