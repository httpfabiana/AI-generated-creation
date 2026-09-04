import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Layout from './pages/Layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import WriteArticle from './pages/WriteArticle/WriteArticle'
import BlogTitle from './pages/BlogTitle/BlogTitle'
import GenerateImages from './pages/GenerateImages/GenerateImages'
import RemoveBackground from './pages/RemoveBackground/RemoveBackground'
import RemoveObject from './pages/RemoveObject/RemoveObject'
import ReviewResume from './pages/ReviewResume/ReviewResume'
import Community from './pages/Community/Community'
import { useEffect} from 'react'
import { useSession } from '@clerk/react'


const App = () => {

   const { session } = useSession();

  useEffect(() => {
    const pegarToken = async () => {
      if (session) {
        try {
          const token = await session.getToken({ template: 'insomnia-teste' });
          console.log("SEU TOKEN PARA O INSOMNIA:", token);
        } catch (error) {
          console.error("Erro ao gerar token:", error);
        }
      }
    };

    pegarToken();
  }, [session]);


  return (

    <div>
      <Routes>
       <Route path='/' element={<Home/>}/>
      
       <Route path='/ai' element={<Layout/>}>
        <Route index element={<Dashboard/>}/>
        <Route path='write-article' element={<WriteArticle/>}/>
        <Route path='blog-titles' element={<BlogTitle/>}/>
        <Route path='generate-images' element={<GenerateImages/>}/>
        <Route path='remove-background' element={<RemoveBackground/>}/>
        <Route path='remove-object' element={<RemoveObject/>}/>
        <Route path='review-resume' element={<ReviewResume/>}/>
        <Route path='community' element={<Community/>}/>

       </Route>
      </Routes>
    </div>

  )
}

export default App
