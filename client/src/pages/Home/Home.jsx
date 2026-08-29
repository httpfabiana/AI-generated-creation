
import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Hero from '../../components/Hero/Hero';
import AiTools from '../../components/AiTools/AiTools';
import Testimonial from '../../components/Testimonial.jsx/Testimonial';
import Plans from '../../components/Plans/Plans';
import Footer from '../../components/Footer/Footer';

const Home = () => {
  return (
   <>
    <Navbar/>
    <Hero/>
    <AiTools/>
    <Testimonial/>
    <Plans/>
    <Footer/>
   </>
  )
}

export default Home;
