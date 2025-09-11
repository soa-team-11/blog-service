import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import Blog from "../models/blog.model.js";
import { doesUserExist, isUserFollowing } from "../external/stakeholder.external.js";

export const create = async (req, res) => {
    try {
        const { author, title, description, images } = req.body;

        const userExists = await doesUserExist(author);

        if (!userExists) {
            return res.status(404).json({
                message: "User was not found."
            });
        }

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

export const postComment = async (req, res) => {
    try {
        const { blogId, author, text } = req.body;

        const userExists = await doesUserExist(author);

        if (!userExists) {
            return res.status(404).json({
                message: "User was not found."
            });
        }

        

        const blog = await Blog.findById(blogId);

        const isFollowing = await isUserFollowing(author, blog.author);

        if (!isFollowing) {
            return res.status(400).json({
                message: "Cannot comment."
            });
        }

        blog.comments.push({
            author,
            text
        })

        await blog.save();
        
        res.status(200).json({
            blog
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Internal server error."
        });
    }
};

export const likeOrUnlike = async (req, res) => {
    try {
        const { user, blogId } = req.body;

        const userExists = await doesUserExist(user);

        if (!userExists) {
            return res.status(404).json({
                message: "User was not found."
            });
        }

        const blog = await Blog.findById(blogId);

        const hasLike = blog.likes.includes(user);

         if (hasLike) {
            blog.likes = blog.likes.filter(id => id !== user);
        } else {
            blog.likes.push(user);
        }

        await blog.save();

   res.status(200).json({
            blog
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Internal server error."
        });
    }
};