
import { useState, useEffect } from "react";
import { useAuth} from '@clerk/react';
import {Newspaper, Sparkles, FileText, Loader2} from 'lucide-react';


const GenerateNews = () => {
  
  const {userId, getToken} = useAuth();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [newsContent, setNewsContent] = useState(() => {
    return localStorage.getItem('minhas_noticias_salvas') || ''
  });

  useEffect(() => {
    if(newsContent){
     localStorage.setItem('minhas_noticias_salavas', newsContent)
    }
  },[newsContent])

  const onSubmitHandler = async(e) => {
    e.preventDefault();

    if (!userId) return alert('Você precisa estar logado para gerar artigos.');

    try{
     setLoading(true);
     setNewsContent('')
     
     const token = await getToken();

     const response = await fetch('http://localhost:3000/api/ai/generate-news-article', {
       method: 'POST',
       headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`
       },
       body: JSON.stringify({
        prompt: input
       })
     });

     const data = await response.json();

     if(data.success){
      setNewsContent(data.content);
      console.log('Artigo em tempo real gerado')

     }else{
       alert('Error no servidor:' + data.message)
     }
    }catch(error) {
      console.log('Error de conexão:', error)
      alert('Error de conexão com servidor')  
    }finally {
      setLoading(false)
    }
  }//#22c55e

   return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
     <form onSubmit={onSubmitHandler} className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center gap-3">
        <Newspaper className="w-6 text-[#f4a460]"/>
        <h1 className="text-xl font-semibold">
          Pesquise sobre  Noticias
        </h1>
      </div>

      <p className="mt-6 text-sm font-medium">
        Qual assunto recente voce quer pesquisar?
      </p>
      <input
        type="text"
        placeholder="Ex: Pesquise sobre o Iphone 17..."
        className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
        required
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
      />

      <button type="submit" disabled={loading} 
      className="w-full flex justify-center items-center gap-2 from-[#22c55e] bg-[#d2691e] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-medium">
       {loading ? (
        <>
         <Loader2 className="w-5 h-5 animate-ping"/>
         Buscando fontes e escrevendo
        </>
       ) : (
        <>
         <Sparkles className="w-5"/>
         Buscar Noticias
        </>
       )}
      </button>
     </form>

     <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px] overflow-y-auto">
      <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
       <FileText className='w-5 h-5 text-[#faa460]'/>
       <h1 className="text-xl font-semibold">
          Noticias Gerada
       </h1>
     </div>  

       {newsContent ? (
        <div className="flex-1 text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100">
         {newsContent}   
        </div>
       ) : (
        <div className="flex-1 flex justify-center items-center">
         <div className="text-sm flex flex-col items-center gap-5 text-gray-600">
          <Newspaper className="w-9 h-9 text-gray-300"/>
          <p>Insira um topico atual e clique em "Buscar noticias" para cruzar os dados da internet.</p>
        </div>  
        </div>
       )}
     </div>
    </div>
   )
}

export default GenerateNews;