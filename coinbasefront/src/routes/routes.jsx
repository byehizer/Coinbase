import { AddOrdersForm } from "../pages/panelAdmi/order/addOrderForm/addOrderForm"
import { OrdersPanel } from "../pages/panelAdmi/order/OrdersPanel"
import { AddProductForm } from "../pages/panelAdmi/productsPanel/addProductForm/addProductForm"
import { EditProductForm } from "../pages/panelAdmi/productsPanel/editProductForm/editProductForm"
import { ProductsPanel } from "../pages/panelAdmi/productsPanel/ProductsPanel"

export const appRoutesAdmin = [
    { path: "/admin/products", element: <ProductsPanel />, name: "Products" },
    { path: "/admin/orders", element: <OrdersPanel />, name: "Orders" },
]

export const appRoutesAdminAddProduct = [
    { path: "/admin/products/add", element: <AddProductForm />, name: "ProductsFormAdd" },
    { path: "/admin/orders/add", element: <AddOrdersForm/>, name: "OrdersFormAdd" },
    { path: "/admin/products/edit", element: <EditProductForm />, name: "editProductForm" },
]

