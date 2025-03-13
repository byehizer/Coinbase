import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Navbar } from './components/Navbar/Navbar'
import { AiOutlineSearch } from "react-icons/ai";
import { SearchBar } from './components/Navbar/components/Searchbar';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar></Navbar>
      
    </>
  )
}

export default App
