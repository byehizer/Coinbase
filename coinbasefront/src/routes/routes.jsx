import { AddOrdersForm } from "../pages/panelAdmi/order/addOrderForm/addOrderForm"
import { OrdersPanel } from "../pages/panelAdmi/order/OrdersPanel"
import { AddProductForm } from "../pages/panelAdmi/productsPanel/addProductForm/addProductForm"
import { ProductsPanel } from "../pages/panelAdmi/productsPanel/ProductsPanel"
import { Home } from "../pages/home"
import { ProductDetail } from "../pages/productdetail"
import { ShoppingCartPage } from "../pages/shoppingcartpage"



export const appRoutesAdmin = [
    { path: "/admin/products", element: <ProductsPanel />, name: "Products" },
    { path: "/admin/orders", element: <OrdersPanel />, name: "Orders" },
]

export const appRoutesAdminAddProduct = [
    { path: "/admin/products/add", element: <AddProductForm />, name: "ProductsFormAdd" },
    { path: "/admin/orders/add", element: <AddOrdersForm />, name: "OrdersFormAdd" },

]

export const appClientRoutes = [
    { path: "/", element: <Home />, name: "Home" },
    { path: "/product/:id", element: <ProductDetail />, name: "ProductDetail" },
    { path: "/shopping-cart", element: <ShoppingCartPage />, name: "ShoppingCart" },
];