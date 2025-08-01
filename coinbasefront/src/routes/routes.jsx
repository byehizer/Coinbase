import React from "react";
import { ContactPage } from "../pages/contactPage/ContactPage"
import { MessagesPanel } from "../pages/panelAdmi/messagesPanel/MessagesPanel"
import { AddOrdersForm } from "../pages/panelAdmi/order/addOrderForm/addOrderForm"
import  EditOrderForm  from "../pages/panelAdmi/order/editOrderForm/editOrderForm"
import { OrdersPanel } from "../pages/panelAdmi/order/OrdersPanel"
import { AddProductForm } from "../pages/panelAdmi/productsPanel/addProductForm/addProductForm"
import  EditProductForm  from "../pages/panelAdmi/productsPanel/editProductForm/editProductForm"
import { ProductsPanel } from "../pages/panelAdmi/productsPanel/ProductsPanel"
import { Home } from "../pages/home"
import { ProductDetail } from "../pages/productdetail"
import { ShoppingCartPage } from "../pages/shoppingcartpage"
import { OrderForm } from "../pages/orderform"
import TrackOrderPage from "../pages/trackorderpage"
import OrderDetailPage from "../pages/orderdetailpage"
import AdminLogin from "../pages/panelAdmi/AdminLogin"
import { SucessPage } from "../pages/sucesspage";
import CancelPage from "../pages/cancelpage";
import AboutPage from "../pages/AboutPage";



export const appRoutesAdmin = [
    { path: "/admin/products", element: <ProductsPanel />, name: "Products" },
    { path: "/admin/orders", element: <OrdersPanel />, name: "Orders" },
    { path: "/admin/messages", element: <MessagesPanel />, name: "Messages" },

]

export const appRoutesAdminAddProduct = [
    { path: "/admin/products/add", element: <AddProductForm />, name: "ProductsFormAdd" },
    //{ path: "/admin/orders/add", element: <AddOrdersForm />, name: "OrdersFormAdd" },
    { path: "/admin/products/edit", element: <EditProductForm />, name: "editProductForm" },
    { path: "/admin/orders/edit", element: <EditOrderForm />, name: "EditOrderForm" },
    
]


export const appClientRoutes = [
    { path: "/admin", element: <AdminLogin />, name: "Admin Login" },
    { path: "/", element: <Home />, name: "Home" },
    { path: "/product/:id", element: <ProductDetail />, name: "Product Detail" },
    { path: "/shopping-cart", element: <ShoppingCartPage />, name: "Shopping Cart" },
    { path: "/orderform", element: <OrderForm />, name: "Order Form" },
    { path: "/track-order", element: <TrackOrderPage />, name: "Track Order" },
    { path: "/order-detail", element: <OrderDetailPage />, name: "Order Detail" },
    { path: "/contact", element: <ContactPage />, name: "contactPage" },
    { path: "/success", element: <SucessPage/>, name: "Sucesspage" },
    { path: "/cancel", element: <CancelPage/>, name: "Cancelpage" },
    { path: "/about", element: <AboutPage/>, name: "Aboutpage" },

];
    

