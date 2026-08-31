
import { Edit, Hash, Sparkles } from 'lucide-react'
import React from 'react';
import { useState } from 'react'

const BlogTitle = () => {

  const blogCategories = ['Em geral', 'Tecnologia', 'negócios', 'Saúde', 'Estilo de vida', 'Educação', 'Viagem', 'Comida']

   const [selectedCategory, setSelectedCategory] = useState('Em geral')

   const [input, setInput] = useState('');

   const onSubmitHandler = async(e) => {
    e.preventDafault();
   }


  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
       <div className='flex items-center gap-3'>
        <Sparkles className='w-6 text-[#8e37eb]'/>
        <h1 className='text-xl font-semibold'>Gerador de títulos com IA</h1>
       </div>

       <p className='mt-6 text-sm font-medium'>
         Palavra-chave
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
         Categoria
       </p>
       <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
        {blogCategories.map((item) => (
          <span onClick={() => setSelectedCategory(item)} key={item} className={`text-xs px-4 py-1 border rounded-full cursor-pointer 
          ${selectedCategory === item ? 'bg-purple-50 text-purple-700' : 'text-gray-500 border-gray-300'}`}>
            {item}
          </span>
        ))}
       </div>
       <br/>
       <button className='w-full flex justify-center items-center gap-2 from-[#c341f6] bg-[#8e37eb] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
        <Hash className='w-5'/>
         Gerar Titulo
       </button>
      </form>

      {/* */}
     <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
      <div className='flex items-center gap-3'>
        <Hash className='w-5 h-5 text-[#8e37eb]'/>
        <h1 className='text-xl font-semibold'>Gerado Titulo</h1>
      </div>

      <div className='flex-1 flex justify-center items-center'>
       <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
        <Hash className='w-9 h-9'/>
        <p>
          Insira um tópico e clique em "Gerar Titulo" para começar.
        </p>
       </div>
      </div>
     </div>
    </div>
  )
}

export default BlogTitle
