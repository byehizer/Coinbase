import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { appRoutesAdmin, appRoutesAdminAddProduct, appClientRoutes } from './routes/routes';
import { ModalProvider } from './context/ModalContext';
import { AiOutlineSearch } from "react-icons/ai";
import { ShoppingCartProvider } from './context/shoppingcartcontext';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/footer'
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';


function App() {
  return (

    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <ShoppingCartProvider>
            <div className='flex flex-col min-h-screen'>
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {appClientRoutes.map(route => (
                    <Route key={route.name} path={route.path} element={route.element} />
                  ))}
                  <Route element={<RequireAuth />}>
                    {appRoutesAdmin.map(route => (
                      <Route key={route.name} path={route.path} element={route.element} />
                    ))}
                    {appRoutesAdminAddProduct.map(route => (
                      <Route key={route.name} path={route.path} element={route.element} />
                    ))}
                  </Route>
                </Routes>
              </main>
              <Footer />
            </div>
          </ShoppingCartProvider>
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App
