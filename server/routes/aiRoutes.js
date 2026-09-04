
import express from 'express'
import { auth } from '../middleware/auth.js';
import { generateArticle, generateBlogTitle, getUserCreations } from '../AIController/aiController.js';


const aiRouter = express.Router();

aiRouter.post('/generate-article', auth, generateArticle);

aiRouter.post('/generate-blog-title', auth, generateBlogTitle)

aiRouter.get('/my-creations', auth, getUserCreations)

export default aiRouter;