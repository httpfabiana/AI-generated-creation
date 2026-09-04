
import { Edit, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import { useSession } from '@clerk/react';

const WriteArticle = () => {

   const articleLength = [
    { length: 800, text: 'Pequeno (500-800 words)' },
    { length: 1200, text: 'Medio (800-1200 words)' },
    { length: 1600, text: 'Longo (1200+ words)' }
  ];

  const { session } = useSession(); // 1. Captura a sessão ativa do usuário logado

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [articleContent, setArticleContent] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault(); // Ajustado de preventDafault para preventDefault

    if (!input.trim()) return alert('Por favor, digite um prompt.');
    if (!session) return alert('Você precisa estar logado para gerar artigos.');

    try {
      setLoading(true);

      // 2. LIGAÇÃO COM O CLERK: Gera o token JWT atualizado
      const token = await session.getToken();

      // 3. FETCH PARA O BACKEND: Conecta na sua rota v2
      const response = await fetch('http://localhost:3000/api/ai/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Middleware 'auth' vai ler esse cara!
        },
        body: JSON.stringify({
          prompt: input,                 // O texto do seu useState
          length: selectedLength.length  // O tamanho escolhido (800, 1200 ou 1600)
        })
      });

      const data = await response.json();

      if (data.success) {
        setArticleContent(data.content); // Salva o artigo gerado pelo Gemini na tela
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
        <Sparkles className='w-6 text-[#4a7aff]'/>
        <h1 className='text-xl font-semibold'>Configuração do Artigo</h1>
       </div>

       <p className='mt-6 text-sm font-medium'>
         tema do artigo
       </p>
       <input
        type='text'
        placeholder='o futuro da inteligência artificial é...'
        className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
        required
        value={input}
        onChange={(e)=> setInput(e.target.value)}
       />
       <p className='mt-4 text-sm font-medium'>
        extensão do artigo
       </p>
       <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
        {articleLength.map((item, index) => (
          <span onClick={() => setSelectedLength(item)} key={index} className={`text-xs px-4 py-1 border rounded-full cursor-pointer 
          ${selectedLength.text === item.text ? 'bg-blue-50 text-blue-700' : 'text-gray-500 border-gray-300'}`}>
            {item.text}
          </span>
        ))}
       </div>
       <br/>
       <button className='w-full flex justify-center items-center gap-2 from-[#22bff] bg-[#65adff] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
        <Edit className='w-5'/>
         Gerar article
       </button>
      </form>

      {/* */}
     <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
      <div className='flex items-center gap-3'>
        <Edit className='w-5 h-5 text-[#4a7aff]'/>
        <h1 className='text-xl font-semibold'>Gerado artigo</h1>
      </div>

      <div className='flex-1 flex justify-center items-center'>
       <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
        <Edit className='w-9 h-9'/>
        <p>
          Insira um tópico e clique em "gerar artigo" para começar.
        </p>
       </div>
      </div>
     </div>
    </div>
  )
}

export default WriteArticle
