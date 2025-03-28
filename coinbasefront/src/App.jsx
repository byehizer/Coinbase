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
import { Home } from './pages/home';
import { ProductDetail } from './pages/productdetail';
import { Footer } from './components/footer'

function App() {
  return (
    <BrowserRouter>
      <ModalProvider>
        <ShoppingCartProvider>
          <div className='flex flex-col min-h-screen'>
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {appRoutesAdmin.map(route => (
                  <Route key={route.name} path={route.path} element={route.element} />
                ))}
                {appRoutesAdminAddProduct.map(route => (
                  <Route key={route.name} path={route.path} element={route.element} />
                ))}
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
              </Routes>
            </main>
            <Footer />
          </div> 
        </ShoppingCartProvider>
      </ModalProvider>
    </BrowserRouter>
  );
}


export default App
