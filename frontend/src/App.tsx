// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'
import { Outlet } from "react-router-dom"

function App() {
  // const [count, setCount] = useState(0);
  console.log("App rendered")
  return (
    <>
      <section>
        <div className='text-center text-2xl'>
          hello world, ini <span className="font-bold">App</span>
          <Outlet />
        </div>
      </section>
    </>
  )
}

export default App
