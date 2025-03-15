import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { Navbar } from './components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { appRoutesAdmin, appRoutesAdminAddProduct } from './routes/routes';
import { ModalProvider } from './context/ModalContext';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <ModalProvider>
          <Navbar></Navbar>
          <Routes>
            {appRoutesAdmin.map(route => (
              <Route key={route.name} path={route.path} element={route.element} />
            ))}
            {appRoutesAdminAddProduct.map(route => (
              <Route key={route.name} path={route.path} element={route.element} />
            ))}
          </Routes>
        </ModalProvider>
      </BrowserRouter>
    </>
  )
}

export default App
