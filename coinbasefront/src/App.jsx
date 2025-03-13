import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { Navbar } from './components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { appRoutes } from './routes/routes';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          {appRoutes.map(route => (
            <Route key={route.name} path={route.path} element={route.element} />
          ))}
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
