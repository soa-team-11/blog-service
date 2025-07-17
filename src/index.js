import express from "express";
import dotenv from "dotenv";

import blogRoutes from "./routes/blog.route.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
connectDB();

app.use(express.json({ limit: "10mb" }));
app.use("/api/blog", blogRoutes);

app.listen(process.env.PORT, () => console.log(`Server is running on PORT: ${process.env.PORT}`));