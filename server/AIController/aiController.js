import PDFParser from 'pdf2json'
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
export const reviewResume = async(req, res) => {
 console.log("Arquivo recebido:", {
  originalname: req.file?.originalname,
  mimetype: req.file?.mimetype,
  size: req.file?.size,
  hasBuffer: !!req.file?.buffer
});

  try{
    const { userId } = getAuth(req);

    if(!userId){
      return res.status(401).json({ success: false, message: 'Usuario não autenticado'})
    }

     const plan = req.plan || 'free';
     const free_usage = req.free_usage || 0;

     if(!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: 'Envie um arquivo PDF valido'})
     }

      const textoCurriculo = await new Promise((resolver, reject) => {
       const pdfParser = new PDFParser(null, 1);

       pdfParser.on('pdfParser_dataError', (errData) => reject(errData.parserError));
       pdfParser.on('pdfParser_dataReady', () => {
        const rawText = pdfParser.getRawTextContent();
        resolver(rawText)
       })
        pdfParser.parseBuffer(req.file.buffer)
      })

      const textoLimpo = textoCurriculo ? textoCurriculo.trim() : ""

    if(textoCurriculo.length < 50) {
      return res.status(400).json({
       success: false,
       message: 'Não foi possivel ler o curriculo do PDF. Certifique-se de que o arquivo contém texto e não e uma imagem escanead.'
      })
    }

    const promptConsolidado = `Você é um recrutador e especialista em RH de tecnologia experiente.
      Analise o currículo a seguir e forneça um feedback estruturado em formato Markdown:

      --- CONTEÚDO DO CURRÍCULO ---
     ${textoLimpo}
     -----------------------------

     Regras de Resposta:
     - Destaque os **Pontos Fortes** do candidato.
     - Aponta **Oportunidades de Melhoria** (layout, clareza, falta de informações chave).
     - Liste **Palavras-chave e Tecnologias** recomendadas para incluir visando sistemas ATS (filtros automáticos de RH).
     - Forneça uma **Nota Geral de 0 a 10** justificando resumidamente.`;

     const response = await AI.chat.completions.create({
      model: 'gemini-3.5-flash',
      messages: [{ role: "user", content: promptConsolidado }],
      temperature: 0.7,
      max_tokens: 2000
     })

     const resultadoTexto = response.choices[0].message.content;

     await sql `
      INSERT INTO Creations(user_id, prompt, content, type)
      VALUES (${userId}, ${req.file.originalname}, ${resultadoTexto}, 'resume-review')
     `;

     if(plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {free_usage: free_usage + 1}
      })
     }

     return res.json({ success: true, content: resultadoTexto})

  }catch(error) {
    console.log("Erro na analise de currículo:", error);
    return res.status(500).json({ success: false, message: "Error interno no servidor ao processa arquivo."})
  }
}

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


