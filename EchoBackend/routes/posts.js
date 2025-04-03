import express from 'express';
import { supabase } from '../app/supabase.js';
const router = express.Router();

import { createPost,getPosts,deletePost } from "../controllers/postControllers.js";
import { 
  likePost, 
  deletelike, 
  getlikes, 
  getcomments, 
  commentPost, 
  updatecomment, 
  deletecomment,
  getUserLikedPosts
} from '../controllers/likecomentsController.js';
import { deletepfp, getbio, getpfp, getusername, updatebio, updatepfp, updateusername } from '../controllers/userController.js';

router.post('/new/:user_id',createPost);
router.delete('/:id/:user_id',deletePost);
router.get('/',getPosts);

// Like routes
router.post('/likes/:id', likePost);
router.delete('/likes/:id', deletelike);
router.get('/likes/:id', getlikes);
router.get('/user-liked-posts', getUserLikedPosts); // Add new endpoint to get user's liked posts

// Comment routes
router.get('/comments/:id', getcomments);
router.post('/comments/:posts_id/:user_id', commentPost);
router.put('/comments/:posts_id/:id', updatecomment);
router.delete('/comments/:posts_id/:id', deletecomment);

router.get('/:id/username',getusername);
router.put('/update-username/:user_id',updateusername);
router.get('/:id/bio',getbio);
router.put('/:user_id/update-bio',updatebio);
router.get('/:id/pfp',getpfp);
router.delete('/:user_id/del-pfp',deletepfp);
router.put('/:user_id/update-pfp',updatepfp);
export default router;
