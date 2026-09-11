import { useEffect, useState } from 'react'
import {dummyCreationData} from '../../assets/assets.js'
import { FileText, Gem, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@clerk/react';
import CreationItem from '../../components/CreationItem/CreationItem.jsx';

const Dashboard = () => {

   const [creations, setCreations] = useState([]);
   const [loading, setLoading] = useState(true)

   const {getToken, has} = useAuth();

   const getDashboard = async() => {
    try{
      setLoading(true)
      const token = await getToken();

      const response = await fetch('http://localhost:3000/api/ai/dashboard', {
       method: 'GET',
       headers: {
        'Authorization': `Bearer ${token}`,
        'Content-type': 'application/json'
       }
      })

       const data = await response.json();

       if(data.success && Array.isArray(data.creations)){
        setCreations(data.creations)
       }else {
        console.log('Erro ao carregar o dashboard', data.message);
        setCreations([])
       }
    }catch(error) {
      console.log('Error de conexão ao buscar dashboard', error)
      setCreations([])
    }finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDashboard()
  },[])

  return (
    <div className='h-full overflow-y-scroll p-6'>
     <div className='flex justify-start gap-4 flex-wrap'>
     
     {/*Cards */}
     <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
      <div className='text-slate-600'>
        <p className='text-sm'>
          Total de Criações
        </p>
        <h2 className='text-xl font-semibold'>
          {loading ? '...' : (creations?.length || 0)}
        </h2>
      </div>

      <div className='w-10 h-10 rounded-lg bg-linear-to-br from-[#3588f2] to-[#0bb0d7] text-white flex justify-center items-center'>
        <Sparkles className='w-5 text-white'/>
      </div>
     </div>

     <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
      <div className='text-slate-600'>
        <p className='text-sm'>
          Plano Ativo
        </p>
        <h2 className='text-xl font-semibold'>
           <p className="text-xs text-gray-500">
            {has({ plan: 'premium' }) ? 'Premium' : 'Free'}
          </p>
        </h2>
      </div>

      <div className='w-10 h-10 rounded-lg bg-linear-to-br from-[#ff61c5] to-[#9e53ee] text-white flex justify-center items-center'>
        <Gem className='w-5 text-white'/>
      </div>
     </div>
     </div>

      <div className='space-y-3'>
       <p className='mt-6 mb-4'>Criações Recentes</p>

       {loading ? (
        <div className='flex items-center gap-2 text-gray-500 p-6 bg-white rounded-xl border border-gray-100 justify-center'> 
         <Loader2 className='w-5 h-5 animate-spin text-blue-500'/>
         <p className='text-sm'>
          Carregando suas criações...
         </p>
        </div>
       ) : creations.length > 0 ? (
          creations.map((item) => (
            <CreationItem key={item.id} item={item}/>
          ))
       ) : (
         <div className='flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-gray-200 text-center text-gray-400 gap-3'>
          <FileText className='w-10 h-10 text-gray-300'/>
          <p className='text-sm font-medium'>Voce ainda não possui nenhuma criação gerada.</p>
          <p className='text-xs text-gray-400'>
            Navegue pelo menu para gera seu primeiro artigo, resumo ou revisão!
          </p>
         </div>
       )}
     </div>
    </div>
  )
}

export default Dashboard
