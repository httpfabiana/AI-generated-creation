import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { clerkClient, getAuth } from '@clerk/express';
import sql from '../configs/db.js';
import { OpenAI } from 'openai'; 

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
});

//GERA ARTICLE
export const generateArticle = async (req, res) => {
  try {
    
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado.'
      });
    }

    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage || 0; 


    if (plan !== 'premium' && free_usage >= 10) {
      return res.status(403).json({
        success: false,
        message: 'Limit reached. Upgrade to continue'
      });
    }

      const targetWords = length ? Number(length) : 800;

      const promptConsolidado = `Você é um redator e criador de conteúdo profissional.
      Escreva um artigo completo, aprofundado e bem estruturado sobre o seguinte tema: "${prompt}".

      Regras Obrigatórias de Escrita:
     - Crie um título chamativo no início do texto.
     - O artigo deve ser extenso e detalhado, visando aproximadamente ${targetWords} palavras.
     - Divida o conteúdo com subtítulos claros em Markdown (use ## para seções).
     - Inclua: Introdução envolvente, Desenvolvimento detalhado (com pontos principais e análises) e Conclusão.
     - Mantenha um tom informativo, fluido e profissional.
     - NÃO faça resumos curtos. Escreva o artigo completo do início ao fim.`;

    const response = await AI.chat.completions.create({
      model: 'gemini-3.5-flash', 
      messages: [
        {
          role: 'user',
          content: promptConsolidado
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

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

    const instrucaoIA = `Crie APENAS 1 título chamativo para um artigo sobre: "${prompt}".

     Regras:
     - Retorne SOMENTE o título, nada mais.
     - Não inclua contagem de palavras, aspas ou explicações.
     - Não use dois-pontos (:).
     - Máximo de 8 palavras.`
     ;

    const response = await AI.chat.completions.create({
      model: 'gemini-3.5-flash', 
      messages: [{ role: 'user', content: instrucaoIA }],
      temperature: 0.7,
      max_tokens: 500
    });

    const resultadoTexto = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${resultadoTexto}, 'blog-title')
    `;

    res.json({ 
      success: true, 
      content: resultadoTexto 
    });

    
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

//GERA ARTIGOS
export const generateNewsArticle = async(req, res) => {
  try{
    const {userId} = getAuth(req);

    if(!userId) {
     return res.status(401).json({ success: false, message: 'Usuario não auteticado'})
    }

    const {prompt} = req.body;
    const plan = req.plan || 'free';
    const free_usage = req.free_usage || 0;

    if(plan !== 'premium' && free_usage >= 10) {
      return res.status(403).json({ success: false, message: 'Limite expirado, se torne premium.'})
    }

    const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(prompt)}&language=pt&sortBy=publishedAt&pageSize=3&apiKey=NEWS_API_KEY`

    const newsResponse = await fetch(newsUrl);
    const newsData = await newsResponse.json();

    let contextoNoticias = "";
    if(newsData.articles && newsData.articles.length > 0) {
      contextoNoticias = newsData.articles.map(art => `Título: ${art.title}\nResumo: ${art.description}\nFonte: ${art.source.name}`).join("\n\n");

    }else {
      contextoNoticias = "Nenhuma notícia recente encontrada para este assunto específico hoje.";
    }

     const promptConsolidado = `Você é um jornalista experiente.
      Escreva um artigo jornalístico profissional, aprofundado, fluido e detalhado sobre o tema: "${prompt}".

      Utilize obrigatoriamente as seguintes notícias reais recentes encontradas na internet como base factual para o seu texto:
    
      ${contextoNoticias}

     Diretrizes de Estrutura e Tamanho:
     - Crie um título chamativo no início do artigo (usando #).
     - Escreva um texto completo de pelo menos 300 a 400 palavras.
     - Organize o artigo com Introdução, pelo menos 3 Seções de Desenvolvimento detalhadas (usando ## para subtítulos) e uma Conclusão.
     - Expanda os fatos apresentados nas notícias de contexto, analisando o impacto do assunto na indústria de tecnologia.
     - Escreva estritamente em formato Markdown com tom profissional e informativo.`;

     const response = await AI.chat.completions.create({
      model: 'gemini-3.5-flash', 
      messages: [{ role: 'user', content: promptConsolidado }],
      temperature: 0.7,
      max_tokens: 2500 // 
     });

     const resultadoTexto = response.choices[0].message.content;

     await sql`
       INSERT INTO creations(user_id, prompt, content, type) 
       VALUES (${userId}, ${prompt}, ${resultadoTexto}, 'news-article')
     `

      res.json({ success: true, content: resultadoTexto});

      if(plan !== 'premium') {
        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: {free_usage: free_usage + 1}
        })
      }

      return;

  }catch(error){
    console.log('Erro no gerador de noticias:', error);
    return res.status(500).json({ success: false, message: error.message})
  }
}

//REVISA CURRICULO
export const reviewResume = async (req, res) => {
  console.log("Arquivo recebido:", req.file?.originalname);

  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Usuário não autenticado' });
    }

    const plan = req.plan || 'free';
    const free_usage = req.free_usage || 0;

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: 'Envie um arquivo PDF válido' });
    }

    // 1. Corrigir acentuação do nome do arquivo
    const originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');

    const pdfData = await pdfParse(req.file.buffer);
    const textoLimpo = pdfData.text ? pdfData.text.trim() : "";

    if (textoLimpo.length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Não foi possível ler o texto do PDF. Certifique-se de que o arquivo contém texto e não é uma imagem escaneada.'
      });
    }

    // 3. Montagem do prompt para a IA
    const promptConsolidado = `Você é um recrutador e especialista em RH de tecnologia experiente.
Analise o currículo a seguir e forneça um feedback estruturado em formato Markdown:

--- CONTEÚDO DO CURRÍCULO ---
${textoLimpo.slice(0, 5000)}
-----------------------------

Regras de Resposta:
- Destaque os **Pontos Fortes** do candidato.
- Aponte **Oportunidades de Melhoria** (layout, clareza, falta de informações chave).
- Liste **Palavras-chave e Tecnologias** recomendadas para incluir visando sistemas ATS.
- Forneça uma **Nota Geral de 0 a 10** justificando resumidamente.

REGRAS DE FORMATAÇÃO:
- NUNCA use código ou formatação LaTeX (como \\rightarrow, \\right, $ ... $).
- Para indicar correções ou substituições, use apenas a seta simples: "Texto Antigo -> Texto Novo" ou "Texto Antigo → Texto Novo".
- Mantenha o texto limpo, direto e formatado estritamente em Markdown padrão.`;

    // 4. Chamada da IA com modelo estável
    const response = await AI.chat.completions.create({
      model: 'gemini-3.5-flash',
      messages: [{ role: "user", content: promptConsolidado }],
      temperature: 0.7,
      max_tokens: 2000
    });

    const resultadoTexto = response.choices[0].message.content;

    // 5. Gravação no banco de dados
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${originalName}, ${resultadoTexto}, 'resume-review')
    `;

    // 6. Atualização de uso no Clerk
    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 }
      });
    }

    return res.json({ success: true, content: resultadoTexto });

  } catch (error) {
    console.error("Erro detalhado na análise de currículo:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Erro interno no servidor ao processar arquivo." 
    });
  }
};

//GetDashboardData
export const getDashboardData = async(req, res) => {
  try{
    const { userId } = getAuth(req);

    if(!userId) {
      return res.status(401).json({ success: false, message: 'Usuario não autenticado'})
    }

    const creations = await sql`
     SELECT id, prompt, content, type, created_at
     FROM Creations
     WHERE user_id = ${userId}
     ORDER BY created_at DESC 
    `

    return res.json({ success: true, creations: creations})

  }catch(error) {
    console.log('Error ao buscar dados do dashboard', error);
    return res.status(500).json({ success: false, message: 'Error interno ao buscar dados do dashboard'})
  }
}


export const deleteCreation = async (req, res) => {
console.log("--> Chegou na rota de exclusão! ID:", req.params.id)

  try {
    const { userId } = getAuth(req);
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Não autorizado' });
    }

    const numericId = Number(id)

    if(isNaN(numericId)) {
      return res.status(400).json({ success: false, message:  'ID invalido'})
    }

    // Tenta deletar
    const result = await sql`
      DELETE FROM creations 
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING id
    `;

    if(result.length === 0) {
      return res.status(404).json({ success: false, message: 'Item não encontrado ou sem permissão'})
    }

    return res.json({ success: true, message: 'Item excluído com sucesso' });

  } catch (error) {
    console.error("Erro ao deletar item:", error);
    return res.status(500).json({ success: false, message: 'Erro ao deletar do servidor' });
  }
};


