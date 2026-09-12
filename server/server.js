import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import aiRouter from './routes/aiRoutes.js';
import noteRouter from './routes/noteRoutes.js'

const app = express();

// O CORS precisa permitir a origem do seu front-end
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Middleware padrão do Clerk v2
app.use(clerkMiddleware());

// Suas rotas
app.use('/api/ai', aiRouter);

app.use('/api/notes', noteRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
