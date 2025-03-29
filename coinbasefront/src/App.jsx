import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { appRoutesAdmin, appRoutesAdminAddProduct } from './routes/routes';
import { ModalProvider } from './context/ModalContext';
import { AiOutlineSearch } from "react-icons/ai";
import { SearchBar } from './components/Navbar/components/Searchbar';
import { ShoppingCartProvider } from './context/shoppingcartcontext';
import { Navbar } from './components/Navbar/Navbar';
import { ToastContainer } from 'react-toastify';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <ModalProvider>
          <ToastContainer />
          <ShoppingCartProvider>
          <Navbar></Navbar>
            <Routes>
              {appRoutesAdmin.map(route => (
                <Route key={route.name} path={route.path} element={route.element} />
              ))}
              {appRoutesAdminAddProduct.map(route => (
                <Route key={route.name} path={route.path} element={route.element} />
              ))}
              </Routes>
          </ShoppingCartProvider>
        </ModalProvider>
      </BrowserRouter>

    </>
  )
}

export default App
