import mongoose, { Schema } from "mongoose";

// Updated schema with images and captions combined in an array of objects
const PostSchema = new Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  // New structure: array of objects containing image and caption pairs
  images: [
    {
      image: { type: String, required: true },
      caption: { type: String, required: true }
    }
  ]
}, { timestamps: true });

export const PostModel = mongoose.model("posts", PostSchema);
