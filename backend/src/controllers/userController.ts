import { NextFunction, Response, Request } from "express";
import { UserModel } from "../frameworks/models/userSchema";
import bcrypt from 'bcrypt'
import IUser from "../entities/user.entity";
import { createJWT } from "../frameworks/utils/jwt.token";
import { JwtPayload } from "../entities/jwt";
import { AuthenticatedRequest } from "../frameworks/middleware/authmiddleware";
import { CloudinaryService } from "../frameworks/utils/cloudinary";
import { PostModel } from "../frameworks/models/postSchema";
import { error } from "console";
import mongoose from "mongoose";

export class UserController {
  private cloudinaryService: CloudinaryService
  constructor(cloudinaryService: CloudinaryService) {
    this.cloudinaryService = cloudinaryService
  }
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("entering");

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const phoneRegex = /^\d{10}$/;

      const { email, name, password, phone } = req.body
      console.log(email, name, password, phone);

      if (!email || !name || !password || !phone) {
        throw new Error("credential error")
      }
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }
      if (!phoneRegex.test(phone)) {
        throw new Error("Phone number must be exactly 10 digits");
      }
      const isEmail = await UserModel.findOne({ email: email })
      if (isEmail !== null) {
        throw new Error("Email already taken")
      }
      const isNumber = await UserModel.findOne({ phoneNumber: phone })
      if (isNumber !== null) {
        throw new Error("phone number is already taken")
      }
      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = new UserModel({
        email: email,
        name: name,
        phoneNumber: phone,
        password: hashedPassword
      })
      console.log(email, name, password);
      const createdUser = await newUser.save()
      res.status(200).json({ status: 'success', data: createdUser })
    } catch (error: any) {
      console.log(error);
      if (error.message === "Email already taken") {
        return res.status(400).json({ message: "Email exist" })
      }
      if (error.message === "phone number is already taken") {
        return res.status(400).json({ message: "phone number is already taken" })
      }


      res.status(400).json({ message: error.message })
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        throw new Error("credential are required")
      }
      const user = await UserModel.findOne({ email: email })
      if (!user || !user.password) {
        throw new Error("user not found")
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        throw new Error("Invalid password")
      }
      const payload = { id: user._id, name: user.name, email: user.email }
      const token = createJWT(payload, 5)
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 15 * 24 * 60 * 60 * 100
      })
      res.status(200).json({ status: 'success', data: token })

    } catch (error: any) {
      res.status(400).json({ message: error.message })

    }

  }

  async saveImage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload;
      console.log("hey user:", user);

      const images = req.body.selectedImages; // Array of base64 images
      const captions = req.body.titles;       // Array of captions

      if (!user || !images || !captions || images.length !== captions.length) {
        return res.status(400).json({ status: "fail", message: "Missing required fields or mismatched arrays" });
      }

      // Upload images to Cloudinary
      const uploadedImages = await Promise.all(
        images.map((image: string) => this.cloudinaryService.uploadImage(image))
      );

      // Combine uploaded images and corresponding captions into an array of objects
      const imageCaptionPairs = uploadedImages.map((uploadedImage: string, index: number) => ({
        image: uploadedImage,       // Cloudinary uploaded image URL
        caption: captions[index]    // Corresponding caption from the array
      }));

      // Check if a post for this user already exists
      const existingPost = await PostModel.findOne({ user_id: user.id });

      if (existingPost) {
        // If a post exists, push the new images into the existing post's images array
        existingPost.images.push(...imageCaptionPairs);
        const updatedPost = await existingPost.save();

        return res.status(200).json({ status: 'success', data: updatedPost });
      } else {
        // If no post exists, create a new post
        const post = new PostModel({
          user_id: user.id,
          images: imageCaptionPairs   // Storing the array of objects
        });

        // Save the post to the database
        const savedPost = await post.save();

        return res.status(200).json({ status: 'success', data: savedPost });
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getUserImages(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload;
      if (!user) {
        return res.status(401).json({ status: "fail", message: "Unauthorized" });
      }
      const userId = user.id;

      const userPosts = await PostModel.find(
        { user_id: userId },
      )


      if (!userPosts.length) {
        return res.status(404).json({ status: "fail", message: "No images found for this user" });
      }

      res.status(200).json({ status: "success", data: userPosts });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }
  async updateImages(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload;

      // Assuming the request body contains an array of images with their captions
      const { updatedImages } = req.body; // Array of { image: string, caption: string }
      console.log("update:", updatedImages);
      console.log("user", user);


      if (!user || !updatedImages) {
        return res.status(400).json({ status: "fail", message: "Missing required fields" });
      }

      // Find the user's existing post
      const existingPost = await PostModel.findOne({ user_id: user.id });

      if (!existingPost) {
        return res.status(404).json({ status: "fail", message: "Post not found" });
      }
      console.log("isExist:", existingPost);
      console.log("updated:", updatedImages);

      // Update the images array
      // Update with new images and captions

      // Save the updated post
      const updatedPost = await PostModel.findOneAndUpdate(
        { user_id: user.id }, // Query to find the post by user_id
        { $set: { images: updatedImages } }, // Update operation
        { new: true } // Option to return the updated document
      );


      return res.status(200).json({ status: 'success', data: updatedPost });
    } catch (error: any) {
      console.log(error);

      res.status(400).json({ message: error.message });
    }
  }

  async updateImage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload;
      const { objId, newImg, newCaption } = req.body;
      console.log("newImg", newImg);

      if (!objId) {
        throw new Error("Object ID (objId) is required");
      }
      const updates: any = {};

      if (newImg && newImg !== '') {
        const imageUrl = await this.cloudinaryService.uploadImage(newImg);
        updates['images.$.image'] = imageUrl;
      }

      if (newCaption) {
        updates['images.$.caption'] = newCaption;
      }

      // Only perform the update if at least one field is present
      if (Object.keys(updates).length > 0) {
        const updateDoc = await PostModel.findOneAndUpdate(
          { user_id: user.id, 'images._id': objId },
          {
            $set: updates, // Update only the fields that have changed
          },
          { new: true }
        );

        return res.status(200).json({ status: 'success', data: updateDoc });
      }

    } catch (error: any) {
      console.log(error);

      res.status(400).json({ message: error.message });
    }
  }
  async deleteImage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { objId } = req.body;
    console.log("getting",objId);
    
    const user = req.user as JwtPayload;
    try {
      const updatedDoc = await PostModel.findOneAndUpdate(
        { user_id: user.id },
        {
          $pull: { images: { _id: objId } }
        }
      );
console.log("updated document",updatedDoc);

      if (updatedDoc) {
        return res.status(200).json({ status: 'success', data: updatedDoc });
      } else {
        return res.status(404).json({ message: 'Document or image not found' });
      }
    } catch (error:any) {
      res.status(400).json({ message: error.message });
    }
  };



}