import { Edit, Sparkles, Hash, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/react'; // 💡 CORREÇÃO: Usando useAuth do @clerk/react igual aos títulos

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: 'Pequeno (500-800 words)' },
    { length: 1200, text: 'Medio (800-1200 words)' },
    { length: 1600, text: 'Longo (1200+ words)' }
  ];

  const { userId, getToken } = useAuth(); 

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [articleContent, setArticleContent] = useState(() => {
    return localStorage.getItem('meus_artigos_salvos') || '';
  });

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
      setArticleContent(''); 

      const token = await getToken();

      const response = await fetch('http://localhost:3000/api/ai/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          prompt: input,                 
          length: Number(selectedLength.length)
        })
      });

      const data = await response.json();

      if (data.success) {
        setArticleContent(data.content);
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
      {/* Formulário de Configuração */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#4a7aff]' />
          <h1 className='text-xl font-semibold'>Configuração do Artigo</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Tema do artigo</p>
        <input
          type='text'
          placeholder='Ex: O futuro da inteligência artificial no mercado de trabalho'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 focus:border-blue-500 transition-colors'
          required
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        
        <p className='mt-4 text-sm font-medium'>Extensão do artigo</p>
        <div className='mt-3 flex gap-2 flex-wrap'>
          {articleLength.map((item, index) => (
            <span 
              onClick={() => !loading && setSelectedLength(item)} 
              key={index} 
              className={`text-xs px-3 py-1.5 border rounded-full cursor-pointer transition-all select-none
              ${selectedLength.text === item.text 
                ? 'bg-blue-50 text-blue-700 border-blue-400 font-medium' 
                : 'text-gray-500 border-gray-300 hover:bg-gray-50'}`}
            >
              {item.text}
            </span>
          ))}
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          className='w-full flex justify-center items-center gap-2 bg-[#4a7aff] hover:bg-blue-600 text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
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

      {/* Painel de Resultados */}
      <div className='w-full max-w-lg p-6 bg-white rounded-lg flex flex-col border border-gray-200 h-[600px]'>
        <div className='flex items-center gap-3 mb-4 border-b border-gray-100 pb-3 shrink-0'>
          <Edit className='w-5 h-5 text-[#4a7aff]' />
          <h1 className='text-xl font-semibold'>Artigo Gerado</h1>
        </div>

        <div className='flex-1 overflow-y-auto pr-2 break-words text-sm leading-relaxed text-slate-800'>
          {articleContent ? (
            <div className='whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100 font-normal'>
              {articleContent}
            </div>
          ) : (
            <div className='h-full flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400 text-center p-4'>
                <Hash className='w-9 h-9 text-gray-300' />
                <p>Insira um tópico e clique em "Gerar Artigo" para começar.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteArticle;