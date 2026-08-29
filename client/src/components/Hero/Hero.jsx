
import React from 'react'
import { useNavigate } from 'react-router-dom'
import {assets} from '../../assets/assets'

const Hero = () => {

   const navigate = useNavigate();

  return (
    <section className="min-h-screen px-4 sm:px-20 xl:px-32 relative flex flex-col items-center justify-center pt-32 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${assets.gradientBackground})`}}>
      
      <div className="text-center mb-25">
        <h1 className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]">
          Crie conteúdo incrível <br />
          <span className="text-primary">
            com ferramentas de IA.
          </span>
        </h1>

        <p className="mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl mx-auto max-sm:text-xs text-gray-600">
          Transforme a criação de conteúdo com nosso conjunto de ferramentas premium de IA.
          Escreva artigos, gere imagens e otimize seu fluxo de trabalho.
        </p>
      </div>

      <div className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs'>
       <button onClick={() => navigate('/ai')} className='bg-primary text-white px-10 py-3 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer'>
         Comece a criar agora
       </button>

        <button className='bg-white px-10 py-3 rounded-lg border border-gray-300 hover:scale-105 active:scale-95 transition'>
           Assista à demonstração 
        </button>
      </div>

      <div className='flex items-center gap-4 mt-8 mx-auto text-gray-600'>
        <img
          src={assets.user_group}
          alt=''
          className='h-8'
        />
         Confiança de mais de 10 mil pessoas
      </div>

    </section>
  )
}

export default Hero
