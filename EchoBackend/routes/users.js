import express from 'express';
import { getUserLikedPosts } from '../controllers/likecomentsController.js';

const router = express.Router();

// Get the list of posts a user has liked
router.get('/liked-posts', getUserLikedPosts);
router.get('/:user_id/liked-posts', getUserLikedPosts); // Alternative route with user_id in params

export default router;
