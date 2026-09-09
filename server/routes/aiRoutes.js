
import express from 'express'
import { auth } from '../middleware/auth.js';
import { generateArticle, generateBlogTitle, generateNewsArticle, } from '../AIController/aiController.js';


const aiRouter = express.Router();

aiRouter.use(express.json())

aiRouter.post('/generate-article', auth, generateArticle);

aiRouter.post('/generate-blog-title', auth, generateBlogTitle)

aiRouter.post('/generate-news-article', auth, generateNewsArticle)

export default aiRouter;