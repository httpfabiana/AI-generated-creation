import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import aiRouter from './routes/aiRoutes.js';
import noteRouter from './routes/noteRoutes.js';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://ai-generated-creation.onrender.com' 
];

app.use(cors({
  origin: function (origin, callback) {
  
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); 
    }
  },
  credentials: true
}));

app.use(express.json());


app.use(clerkMiddleware());


app.use('/api/ai', aiRouter);
app.use('/api/notes', noteRouter);

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});