import { useState, useEffect } from 'react';
import {useAuth} from '@clerk/react'
import { Sparkles, Hash, Loader2 } from 'lucide-react';

const BlogTitle = () => {
  const {userId, getToken} = useAuth()

  const blogCategories = ['Em geral', 'Tecnologia', 'negócios', 'Saúde', 'Estilo de vida', 'Educação', 'Viagem', 'Comida'];

  const [selectedCategory, setSelectedCategory] = useState('Em geral');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
    const [titlesResult, setTitlesResult] = useState(() => {
    return localStorage.getItem('meus_titulos_salvos') || '';
  });

    useEffect(() => {
    if (titlesResult) {
      localStorage.setItem('meus_titulos_salvos', titlesResult);
    }
  }, [titlesResult]);

  const onSubmitHandler = async (e) => {
    e.preventDefault(); 

    if (!input.trim()) return alert('Por favor, insira uma palavra-chave.');
    
    try {
      setLoading(true);
      setTitlesResult('');

      // 1. Testa se o Clerk está gerando o token de fato
      const token = await getToken();
      if (!token) {
        alert('ERRO: O Clerk não gerou nenhum Token. Você está realmente logado no app?');
        setLoading(false);
        return;
      }

      // 2. Faz o disparo para o servidor
      const response = await fetch('http://localhost:3000/api/ai/generate-blog-title', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: input,
          category: selectedCategory
        })
      });

      // 3. Lê o texto bruto da resposta antes de converter para JSON
      const textoBruto = await response.text();
      alert('RESPOSTA BRUTA DO SERVIDOR: ' + textoBruto);

      // 4. Converte para objeto para atualizar o estado da tela
      const data = JSON.parse(textoBruto);
      if (data.success) {
        setTitlesResult(data.content); 
      } else {
        alert('O servidor respondeu com erro: ' + data.message);
      }

    } catch (error) {
      console.error(error);
      alert('Erro crítico na requisição: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#8e37eb]' />
          <h1 className='text-xl font-semibold'>Gerador de títulos com IA</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Palavra-chave</p>
        <input
          type='text'
          placeholder='o futuro da inteligência artificial é...'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          required
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />

        <p className='mt-4 text-sm font-medium'>Categoria</p>
        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {blogCategories.map((item) => (
            <span
              onClick={() => !loading && setSelectedCategory(item)}
              key={item}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition-all
              ${selectedCategory === item ? 'bg-purple-50 text-purple-700 border-purple-400 font-medium' : 'text-gray-500 border-gray-300 hover:bg-gray-50'}`}
            >
              {item}
            </span>
          ))}
        </div>
        <br />

        <button
          type="submit"
          disabled={loading}
          className='w-full flex justify-center items-center gap-2 from-[#c341f6] bg-[#8e37eb] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? (
            <>
              <Loader2 className='w-5 h-5 animate-spin' />
              Criando títulos...
            </>
          ) : (
            <>
              <Hash className='w-5' />
              Gerar Título
            </>
          )}
        </button>
      </form>

      {/* Bloco de Resultado Lateral */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px] overflow-y-auto'>
        <div className='flex items-center gap-3 mb-4 border-b border-gray-100 pb-3'>
          <Hash className='w-5 h-5 text-[#8e37eb]' />
          <h1 className='text-xl font-semibold'>Títulos Gerados</h1>
        </div>

        {titlesResult ? (
          <div className='flex-1 text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100'>
            {titlesResult}
          </div>
        ) : (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400 text-center p-4'>
              <Hash className='w-9 h-9 text-gray-300' />
              <p>Insira um tópico e clique em "Gerar Título" para começar.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitle;