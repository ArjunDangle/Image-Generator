import express from 'express';
import * as dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';
import axios from 'axios';
import mongoose from 'mongoose';



import Post from '../mongodb/models/post.js'

dotenv.config()

const router = express.Router();
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
})

//GET ALL POSTS ROUTE
router.get('/', async(req, res) =>{
    try {
        const posts = await Post.find({});

        res.status(200).json({success : true, data : posts})
    } catch (error) {
        res.status(500).json({success : false, error : message})
    }
})

//CREATE POST ROUTE
router.post('/', async(req, res) =>{
   try {
    const { name , prompt, photo } = req.body;
    const photoUrl = await cloudinary.uploader.upload(photo);

    const newPost = await Post.create({
        name,
        prompt,
        photo : photoUrl.url,
    })

    res.status(201).json({success : true, data : newPost});

   } catch (error) {
    res.status(500).json({success: false , message : error})
   }
})

//DELETE POST ROUTE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Received delete request for ID: ${id}`); // ✅ Log the ID

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid ID format');
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      console.log('Post not found');
      return res.status(404).json({ error: 'Post not found' });
    }

    console.log('Post deleted successfully');
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});


export default router;
