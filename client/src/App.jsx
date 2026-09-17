import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Layout from './pages/Layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import WriteArticle from './pages/WriteArticle/WriteArticle'
import BlogTitle from './pages/BlogTitle/BlogTitle'
import GenerateNews from './pages/GenerateNews/GenerateNews'
import ReviewResume from './pages/reviewresume/reviewresume'
import { useEffect} from 'react'
import { useSession } from '@clerk/react'
import Notes from './pages/Notes/notes'



const App = () => {

   const { session } = useSession();

  useEffect(() => {
    const pegarToken = async () => {
      if (session) {
        try {
          const token = await session.getToken({ template: 'insomnia-teste' });
          console.log("SEU TOKEN:", token);
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
        <Route path='generate-news' element={<GenerateNews/>}/>
        <Route path='review-resume' element={<ReviewResume/>}/>
        <Route path='notas'  element={<Notes/>}/>

       </Route>
      </Routes>
    </div>

  )
}

export default App
