import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import aiRouter from './routes/aiRoutes.js';
import noteRouter from './routes/noteRoutes.js';

const app = express();

// Atualize esta lista com o seu link exato da Vercel
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://ai-generated-creation.onrender.com' // <-- Substitua pelo seu domínio da Vercel
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origin (como mobile apps ou curl) ou se estiver na lista permitida
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Ou troque por 'callback(null, true)' para liberar qualquer origem se preferir
    }
  },
  credentials: true
}));

app.use(express.json());

// Middleware padrão
app.use(clerkMiddleware());

// Rotas
app.use('/api/ai', aiRouter);
app.use('/api/notes', noteRouter);

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});