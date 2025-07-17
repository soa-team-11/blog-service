import express from "express";
import dotenv from "dotenv";

import blogRoutes from "./routes/blog.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/blog", blogRoutes);

app.listen(process.env.PORT, () => console.log(`Server is running on PORT: ${process.env.PORT}`));