import { FileText, Sparkles, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {useAuth} from '@clerk/react'
import ReactMarkdown from 'react-markdown';
import { api } from '../../config/api';

const ReviewResume = () => {

   const {getToken} = useAuth()

   const [file, setFile] = useState(null);
   const [loading, setLoading] = useState(false)
   const [result, setResult] = useState(() => {
    return localStorage.getItem('meus_curriculos_salvos') || '';
   })

   useEffect(() => {
    if(result) {
      return localStorage.setItem('meus_curriculos_salvos', result)
    }
   },[result])
     
   const onSubmitHandler = async(e) => {
     e.preventDefault();

     if(!file) {
      alert('Selecione um arquivo PDF.')
      return;
     }
     setLoading(true);
     setResult('')

     const formData = new FormData();
     formData.append('file', file)

     try{
       const token = await getToken();

       const {data} = await api.post('/api/ai/review-resume', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
       }
      )

       localStorage.removeItem('@app:curriculo_draft');
       localStorage.removeItem('@app:vaga_draft');
      

       if(data.success) {
        setResult(data.content)
       }else {
        alert(data.message || 'Erro ao analisar currículo')
       }

     }catch(error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro inesperado na requisição'
      console.log('Erro na requisição:', error)
      alert('Error ao conectar com o servidor:' + errorMessage)
     }finally {
      setLoading(false)
     }
   }

  return (
   <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
         <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
          <div className='flex items-center gap-3'>
           <Sparkles className='w-6 text-[#00da83]'/>
           <h1 className='text-xl font-semibold'>Análise de currículo</h1>
          </div>
   
          <p className='mt-6 text-sm font-medium'>
            Enviar currículo
          </p>
          <input
           type='file'
           accept='application/pdf'
           className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600'
           required
           onChange={(e)=> setFile(e.target.files[0])}
          />
          
          <p className='text-xs text-gray-500 font-light mt-1'>
            Aceita apenas currículos em PDF.
          </p>
          
          <button className='w-full flex justify-center items-center gap-2 bg-[#00da83]  text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
            {loading ? (
             <>
              <Loader2 className='w-5 h-5 animate-spin'/>
              Analisando...
             </>
            ) : (
              <>
               <FileText className='w-5'/>
               Revisar currículo
              </>
            )}
          </button>
         </form>
   
         {/* */}
        <div className='w-full max-w-lg p-6 bg-white rounded-lg flex flex-col border border-gray-200 h-[600px]'>
         <div className='flex items-center gap-3 mb-4 shrink-0'>
           <FileText className='w-5 h-5 text-[#00da83]'/>
           <h1 className='text-xl font-semibold'>Resultados da análise</h1>
         </div>
   
         <div className='flex-1 overflow-y-auto pr-2 break-words text-sm leading-relaxed text-slate-800'>
         {result ? (
          <div className='whitespace-pre-line'>
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
         ) : (
           <div className='flex-1 flex justify-center items-center'>
           <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
           <FileText className='w-9 h-9'/>
           <p>
             Carregue uma image e click em "Revisar currículo" para começar.
           </p>
          </div>
         </div>
         )}
         </div>
        </div>
       </div>
  )
}

export default ReviewResume
