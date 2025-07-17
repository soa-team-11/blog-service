import cloudinary from "../config/cloudinary.js";
import Blog from "../models/blog.model.js";

export const create = async (req, res) => {
    try {
        const { author, title, description, images } = req.body;

        let imageURLs = [];

        if (images) {
            const uploadPromises = images.map(image => cloudinary.uploader.upload(image, {
                folder: "blogs"
            }));

            const results = await Promise.all(uploadPromises);
            imageURLs = results.map(result => result.secure_url);
        }

        const blog = await Blog.create({
            author,
            title,
            description,
            images: imageURLs
        });

        res.status(201).json({
            blog
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};