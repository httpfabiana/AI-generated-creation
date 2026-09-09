
import { Edit, Hash, Sparkles, Image, Loader2 } from 'lucide-react'
import React from 'react';
import { useState } from 'react'
import {useAuth} from '@clerk/react'
import { useEffect } from 'react';

const GenerateImages = () => {

    const {userId, getToken} = useAuth();
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const [generateImage, setGenerateImage] = useState(() => {
      return localStorage.getItem('minha_image_salva' || '')
    });

    useEffect(() => {
      if(generateImage){
        localStorage.setItem('minha_image_salva', generateImage)
      }
    }, [generateImage])

    const onSubmitHandler = async(e) => {
      e.preventDefault();

      try{
        setLoading(true);
        setGenerateImage('');

       const token = await getToken();

       const response = await fetch('http://localhost:3000/api/ai/generate-image', {
        method: 'POST',
        headers: {
          'Content': 'application/json',
          'Authorization': `Bearer ${token}`
        },

        body: JSON.stringify({
         prompt: input
        })
       })

       const data = await response.json();

       if(data.success){
         setGenerateImage(data.Content);
         console.log('Imagem gerada com sucesso')
       }else {
        alert('Error no servidor:' + data.message)
       }

      }catch(error) {
        console.log('Error de conexão:', error);
        alert('Error de conexão com servidor.')
      }finally {
        setLoading(false)
      }
    }

    return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* Formulário de Configuração */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#ff4a9a]' />
          <h1 className='text-xl font-semibold'>Gerador de Imagens com IA</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>O que você quer criar?</p>
        <textarea
          placeholder='Um astronauta andando a cavalo em Marte, estilo cyberpunk, realista...'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 min-h-24 resize-none'
          required
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className='w-full flex justify-center items-center gap-2 from-[#ff4a9a] bg-[#ff4a85] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-medium'
        >
          {loading ? (
            <>
              <Loader2 className='w-5 h-5 animate-spin' />
              Renderizando imagem no Clipdrop...
            </>
          ) : (
            <>
              <Image className='w-5' />
              Gerar Imagem
            </>
          )}
        </button>
      </form>

      {/* Bloco de Visualização da Imagem */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3 mb-4 border-b border-gray-100 pb-3'>
          <Image className='w-5 h-5 text-[#ff4a9a]' />
          <h1 className='text-xl font-semibold'>Imagem Gerada</h1>
        </div>

        {generateImage ? (
          <div className='flex-1 flex flex-col items-center justify-center gap-4 bg-slate-50 p-2 rounded-lg border border-slate-100 relative group animate-fade-in'>
            {/* 💡 A MÁGICA: A string Base64 do Neon é lida direto pela tag img nativa! */}
            <img 
              src={generateImage} 
              alt="IA Generated" 
              className='max-w-full max-h-80 object-contain rounded-md shadow-sm border border-gray-200'
            />
            
            {/* Botão de Download para baixar a foto em formato físico */}
            <a 
              href={generateImage} 
              download="criacao-ia.png"
              className='flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900 transition-colors shadow-sm'
            >
              <Download className='w-4 h-4' /> Baixar Imagem
            </a>
          </div>
        ) : (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400 text-center p-4'>
              <Image className='w-9 h-9 text-gray-300' />
              <p>Digite uma descrição no painel esquerdo e clique em "Gerar Imagem".</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenerateImages
