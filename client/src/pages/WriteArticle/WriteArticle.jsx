import { Edit, Sparkles, Hash, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/react'; // 💡 CORREÇÃO: Usando useAuth do @clerk/react igual aos títulos

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: 'Pequeno (500-800 words)' },
    { length: 1200, text: 'Medio (800-1200 words)' },
    { length: 1600, text: 'Longo (1200+ words)' }
  ];

  // 💡 CORREÇÃO: Extraindo o método getToken direto do useAuth
  const { userId, getToken } = useAuth(); 

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Captura o artigo salvo no localStorage ao carregar a página
  const [articleContent, setArticleContent] = useState(() => {
    return localStorage.getItem('meus_artigos_salvos') || '';
  });

  // 💡 CORREÇÃO: useEffect para salvar o artigo no navegador e não sumir no F5
  useEffect(() => {
    if (articleContent) {
      localStorage.setItem('meus_artigos_salvos', articleContent);
    }
  }, [articleContent]);

  const onSubmitHandler = async (e) => {
    e.preventDefault(); 

    if (!input.trim()) return alert('Por favor, digite um prompt.');
    if (!userId) return alert('Você precisa estar logado para gerar artigos.');

    try {
      setLoading(true);
      setArticleContent(''); // Limpa a tela anterior antes de carregar o novo

      // 💡 CORREÇÃO: Pega o token direto do useAuth
      const token = await getToken();

      const response = await fetch('http://localhost:3000/api/ai/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          prompt: input,                 
          length: Number(selectedLength.length) // Garante que é enviado como número limpo
        })
      });

      const data = await response.json();

      if (data.success) {
        setArticleContent(data.content); // Exibe o artigo na tela
        console.log('Artigo gerado com sucesso:', data.content);
      } else {
        alert('Erro do servidor: ' + data.message);
      }

    } catch (error) {
      console.error('Erro ao conectar com o backend:', error);
      alert('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#4a7aff]' />
          <h1 className='text-xl font-semibold'>Configuração do Artigo</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Tema do artigo</p>
        <input
          type='text'
          placeholder='o futuro da inteligência artificial é...'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          required
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        
        <p className='mt-4 text-sm font-medium'>Extensão do artigo</p>
        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {articleLength.map((item, index) => (
            <span 
              onClick={() => !loading && setSelectedLength(item)} 
              key={index} 
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition-all
              ${selectedLength.text === item.text ? 'bg-blue-50 text-blue-700 border-blue-400 font-medium' : 'text-gray-500 border-gray-300 hover:bg-gray-50'}`}
            >
              {item.text}
            </span>
          ))}
        </div>
        <br />
        
        {/* 💡 CORREÇÃO: Adicionado o type="submit" e o spinner de loading */}
        <button 
          type="submit"
          disabled={loading}
          className='w-full flex justify-center items-center gap-2 from-[#22bff] bg-[#65adff] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? (
            <>
              <Loader2 className='w-5 h-5 animate-spin' />
              Escrevendo artigo...
            </>
          ) : (
            <>
              <Edit className='w-5' />
              Gerar Artigo
            </>
          )}
        </button>
      </form>

      {/* Bloco de Resultado Direito */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px] overflow-y-auto'>
        <div className='flex items-center gap-3 mb-4 border-b border-gray-100 pb-3'>
          <Edit className='w-5 h-5 text-[#4a7aff]' />
          <h1 className='text-xl font-semibold'>Gerado Artigo</h1>
        </div>

        {articleContent ? (
          <div className='flex-1 text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100'>
            {articleContent}
          </div>
        ) : (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400 text-center p-4'>
              <Hash className='w-9 h-9 text-gray-300' />
              <p>Insira um tópico e clique em "Gerar Artigo" para começar.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteArticle;