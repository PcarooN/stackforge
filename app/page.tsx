import link from 'next/link'
import Nav from './components/layout/Navbar/Nav'
import Footer from './components/layout/Footer/Footer'
import Hero from './components/sections/Hero'
import Features from './components/sections/Features'
import Showcase from './components/sections/Showcase'
import Pricing from './components/sections/Pricing'
import Support  from './components/sections/Support'
import FAQ from './components/sections/FAQ'
import Benchmarks from './components/sections/Benchmarks'
import Metrics from './components/sections/Metrics'
import TerminalCTA from './components/sections/TerminalCTA'
import { supabase } from '@/lib/supabase';



export default function Home() {
  return(
    <>
    <Nav/>


    <Hero/>
    <Metrics/>
    <Features/>
    <Showcase/>
    <Benchmarks/>
    <Pricing/>
    <Support/>
    <FAQ/>  
    <TerminalCTA/> 


    <Footer/>
    </>
  );
}1