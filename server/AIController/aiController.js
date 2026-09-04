import { clerkClient, getAuth } from '@clerk/express';
import sql from '../configs/db.js';
import { OpenAI } from 'openai'; // Ajustado o path de import para o padrão do SDK se necessário

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
});

export const generateArticle = async (req, res) => {
  try {

     if (!req || !req.auth) {
      return res.status(401).json({
        success: false,
        message: 'A requisição não foi autenticada pelo middleware do Clerk.'
      });
    }
    
    // 1. Recupera o estado de autenticação do Clerk
    const { userId } = getAuth(req);

    // Proteção extra: Garante que a requisição possui um usuário logado
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado.'
      });
    }

    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage || 0; // Fallback de segurança caso venha undefined

    // 2. Validação do limite de uso gratuito
    if (plan !== 'premium' && free_usage >= 10) {
      return res.status(403).json({ // Usando status 403 para Forbidden/Limite Atingido
        success: false,
        message: 'Limit reached. Upgrade to continue'
      });
    }

    // 3. Chamada da IA (Certifique-se de usar o nome correto do modelo do Gemini)
    const response = await AI.chat.completions.create({
      model: 'gemini-3.5-flash', // Altere para o modelo correto configurado no seu painel (ex: gemini-1.5-flash ou gemini-2.0-flash)
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: length ? Number(length) : undefined // Garante que é um número
    });

    const content = response.choices[0].message.content;

    // 4. Salva no banco de dados PostgreSQL
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    // 5. Incrementa o uso no Clerk apenas para usuários do plano free
    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1
        }
      });
    }

    return res.json({ success: true, content });

  } catch (error) {
    console.error('ERRO NO CONTROLLER:', error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//ROTA BLOG-TITLE
export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
    }

    const { prompt } = req.body;
    const plan = req.plan || 'free';
    const free_usage = req.free_usage || 0;

    if (plan !== 'premium' && free_usage >= 10) {
      return res.status(403).json({ success: false, message: 'Limit reached. Upgrade to continue' });
    }

    const instrucaoIA = `Gere uma lista com os 5 melhores títulos de blog atraentes sobre o assunto: "${prompt}". Retorne apenas a lista de 1 a 5 sem introduções ou textos extras.`;

    const response = await AI.chat.completions.create({
      model: 'gemini-3.5-flash', 
      messages: [{ role: 'user', content: instrucaoIA }],
      temperature: 0.7,
      max_tokens: 300 
    });

    const resultadoTexto = response.choices[0].message.content;

    // Salva no Neon
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${resultadoTexto}, 'blog-title')
    `;

    // Responde o front de imediato para não perder o valor da string
    res.json({ 
      success: true, 
      content: resultadoTexto 
    });

    // Atualiza metadados em segundo plano
    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 }
      });
    }

    return;

  } catch (error) {
    console.error('ERRO CRÍTICO NO CONTROLLER:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//GENERATE IMAGE
export const generateImage = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
    }

    const { prompt, publish } = req.body;
    const plan = req.plan || 'free';
    const free_usage = req.free_usage || 0;

    if (plan !== 'premium' && free_usage >= 10) {
      return res.status(403).json({ success: false, message: 'Esse recurso esta apenas para quem e premium' });
    }

    const instrucaoIA = `Gere uma lista com os 5 melhores títulos de blog atraentes sobre o assunto: "${prompt}". Retorne apenas a lista de 1 a 5 sem introduções ou textos extras.`;

    const response = await AI.chat.completions.create({
      model: 'gemini-3.5-flash', 
      messages: [{ role: 'user', content: instrucaoIA }],
      temperature: 0.7,
      max_tokens: 300 
    });

    const resultadoTexto = response.choices[0].message.content;

    // Salva no Neon
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${resultadoTexto}, 'blog-title')
    `;

    // Responde o front de imediato para não perder o valor da string
    res.json({ 
      success: true, 
      content: resultadoTexto 
    });

    // Atualiza metadados em segundo plano
    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 }
      });
    }

    return;

  } catch (error) {
    console.error('ERRO CRÍTICO NO CONTROLLER:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


