import React from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import Services from './Services'
import Partners from './Partners'
import AboutUs from './AboutUs'
import Footer from './Footer'
import AdminDashboard from './admin'
export default function index() {
  return (
    <div>
        <Navbar/>
        <Hero/>
        <Services/>
        <Partners/>
        <AboutUs/>
        <Footer/>
{/* <AdminDashboard/> */}
    </div>
  )
}
