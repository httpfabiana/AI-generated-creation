
import { useState } from 'react';
import Markdown from 'react-markdown';
import { useAuth } from '@clerk/react';
import { Trash2 } from 'lucide-react';
import Swal from 'sweetalert2'
import toast from 'react-hot-toast';

const CreationItem = ({item, onDelete}) => {

   const {getToken} = useAuth()

   const [expanded, setExpanded] = useState(false);

   const formattedDate = item?.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : ''


  const handleDelete = async (e, id) => {
   if (e && e.stopPropagation) {
    e.stopPropagation();
   }

   console.log("ID que será deletado:", id);

   if (!id || typeof id === 'object') {
    console.error("ERRO: ID inválido recebido:", id);
    return;
  }

   const result = await Swal.fire({
    title: 'Tem certeza?',
    text: 'Esta ação não poderá ser desfeita.',
    icon: 'warning',
    width: '320px',
    heightAuto: '600px',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar',
    customClass: {
      popup: '!py-3 !px-4 !rounded-xl',
      icon: '!w-10 !h-10 !my-1 scale-75',
      title: '!text-sm !font-semibold !pt-1',
      htmlContainer: '!text-xs !mt-1 !mb-2',
      actions: '!mt-1 !gap-2',
      confirmButton: '!px-3 !py-1.5 !text-xs',
      cancelButton: '!px-3 !py-1.5 !text-xs'
    }
   })

   if(!result.isConfirmed){
    return;
   }

  try {
    const token = await getToken();

    const response = await fetch(`http://localhost:3000/api/ai/creation/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      toast.success('Excluído com sucesso!', {
       style: {
        background: '#10b981',
        color: '#ffffff',
        fontWeight: '500',
        borderRadius: '10px'
       }, 
       iconTheme: {
        primary: '#ffffff',
        secondary: '#10b981'
       }
      })

      if (onDelete) {
        onDelete(id);
      }
    } else {
      alert(data.message || 'Erro ao excluir');
    }
  } catch (error) {
    console.error("Erro ao excluir:", error);
  }
};

  
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
        <div className='flex items-center gap-2'>
         <span className='bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] text-xs font-semibold px-3 py-1 rounded-full'>
          {item?.type}
         </span>
         <button onClick={(e) => handleDelete(e, item.id)} className='text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition' title='Excluir'>
           <Trash2/>
         </button>
        </div>
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
