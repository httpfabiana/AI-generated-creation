import React, { useEffect, useState } from 'react'
import {dummyCreationData} from '../../assets/assets.js'
import { Gem, Sparkles } from 'lucide-react';
import { useAuth } from '@clerk/react';
import CreationItem from '../../components/CreationItem/CreationItem.jsx';

const Dashboard = () => {

  const [creations, setCreations] = useState([]);

  const {has} = useAuth();

  const getDashboard = async() => {
   setCreations(dummyCreationData)
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
          {creations.length}
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

       {creations.map((item)=> <CreationItem key={item.id} item={item}/>)}
     </div>
    </div>
  )
}

export default Dashboard
