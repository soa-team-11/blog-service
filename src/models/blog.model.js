import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    author: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const blogSchema = new mongoose.Schema({
    author: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: [true, "Title is required."]
    },
    description: {
        type: String,
        required: [true, "Title is required."]
    },
    images: [String],
    comments: [commentSchema],
    likes: [Number]
}, {
    timestamps: true
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;