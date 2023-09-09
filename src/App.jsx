import React from 'react'
import Hero from './components/Hero'
import Demo from './components/Demo'
import Footer from './components/Footer'

import "./App.css"
const App = () => {
  return (
   <main>
        <div className='main'>
            <div className='gradient'></div>
        </div>

        <div className='app'>
            <Hero />
            <Demo />
            
        </div>

   </main>
  )
}

export default App
