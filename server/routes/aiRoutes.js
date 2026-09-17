
import express from 'express'
import multer from 'multer'
import path from 'path'
import { auth } from '../middleware/auth.js';
import { deleteCreation, generateArticle, generateBlogTitle, generateNewsArticle, getDashboardData, reviewResume, } from '../AIController/aiController.js';


const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
  fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
   const extValida = path.extname(file.originalname).toLowerCase()

   const mimeValido = file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/x-pdf' ||
    file.mimetype === 'application/acrobat';

   if(extValida || mimeValido) {
    cb(null, true)

   }else {
    cb(new Error('Apenas arquivos no formato PDF são aceitos', false))
   }
  }
})

const aiRouter = express.Router();

aiRouter.use(express.json())

aiRouter.post('/generate-article', auth, generateArticle);

aiRouter.post('/generate-blog-title', auth, generateBlogTitle)

aiRouter.post('/generate-news-article', auth, generateNewsArticle)

aiRouter.post('/review-resume', upload.single('file'), reviewResume)

aiRouter.get('/dashboard', getDashboardData)

aiRouter.delete('/creation/:id', deleteCreation)

export default aiRouter;