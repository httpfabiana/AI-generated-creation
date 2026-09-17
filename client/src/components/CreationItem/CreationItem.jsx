
import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { useAuth } from '@clerk/react';

const CreationItem = ({item}) => {

   const {getToken} = useAuth()

   const [expanded, setExpanded] = useState(false);

   const formattedDate = item?.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : ''

   const [creations, setCreations] = useState('')

   const handleDelete = async(id) => {
    if(!window.confirm('Tem certeza que deseja excluir ?')) {
      return;
    }
      
    try{
    const token = await getToken();
    const response = await fetch(`http://localhost:3000/api/ai/creation/${id}`, {
      method: 'DELETE',
      headers: {
       Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json()

    if(data.success) {
     setCreations((prev) => prev.filter((item) => item.id !== id))
    }else {
      alert(data.message || 'Erro ao excluir')
    }
   }catch(error) {
    console.log('Erro ao excluir:', error)
    alert("Falha ao comunicar com servidor")
   }
  }

  
  return (
    <div onClick={()=> setExpanded(!expanded)} className='p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer'>
     <div className='flex justify-between items-center gap-4'>
       <div>
        <h2>
          {item?.prompt || 'Sem título / prompt'}
        </h2>
        <p className='text-gray-500'>
         {item.type} - 
         {formattedDate && `-${formattedDate}`}
        </p>
       </div>
       <button className='bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] px-4 py-1 rounded-full'>
         {item?.type}
       </button>
     </div>

      {expanded && (
        <div className='mt-3 pt-3 border-t border-gray-100'>
         {item?.type === 'image' ? (
           <div>
             <img 
              src={item?.content}
              alt=''
              className='mt-3 w-full max-w-md rounded-lg border border-gray-200'
             />
           </div>
         ) : (
           <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-700'>
            <div className='reset-tw'>
             <Markdown>
               {item?.content || ''} 
            </Markdown> 
            </div>
           </div>  
         )}   
        </div>
      )}
    </div>
  )
}

export default CreationItem;
