import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { appRoutesAdmin } from "../../../routes/routes";
import { useModal } from "../../../context/ModalContext";

export function OrdersPanel() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { openModal } = useModal();
    const navigate = useNavigate();

    const deleteProduct = async () => {
        await openModal({
            title: "Confirm Deletion",
            text: "Are you sure you want to delete this order?",
        });
    };

    const redirectToAddOrder = () => {
        navigate("/admin/orders/add");  
    };


    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`w-64 bg-blue-900 text-white p-5 fixed md:static top-0 left-0 h-full transition-transform duration-300 
                ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
                <button className="md:hidden text-white text-xl absolute top-2 right-4" onClick={() => setMenuOpen(false)}>✖</button>
                <h2 className="text-2xl font-bold mb-5">Admin Panel</h2>
                <ul>
                    {appRoutesAdmin.map(route => (
                        <li className="mb-2 py-2 px-4 hover:bg-blue-700 rounded cursor-pointer transition duration-200" key={route.name}>
                            <Link className="block w-full h-full text-white" to={route.path} onClick={() => setMenuOpen(false)}>
                                {route.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Botón para abrir menú en mobile */}
            <button className={`md:hidden absolute top-16 left-0 text-blue-900 text-2xl p-2 border-2 border-gray-400 rounded bg-gray-200 ${menuOpen ? "hidden" : ""}`} onClick={() => setMenuOpen(true)}>☰</button>

            {/* Contenido Principal */}
            <div className="flex-1 p-6">
                <h1 className="text-3xl font-semibold mb-6 text-center">Orders Management</h1>

                {/* Modo Tabla en pantallas grandes */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 text-sm md:text-base">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4 border">ID</th>
                                <th className="py-2 px-4 border">Client Name</th>
                                <th className="py-2 px-4 border">Client Email</th>
                                <th className="py-2 px-4 border">Order Date</th>
                                <th className="py-2 px-4 border">Total</th>
                                <th className="py-2 px-4 border">Status</th>
                                <th className="py-2 px-4 border">Payment Method</th>
                                <th className="py-2 px-4 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-2 px-4 border">1</td>
                                <td className="py-2 px-4 border">John Doe</td>
                                <td className="py-2 px-4 border">john@example.com</td>
                                <td className="py-2 px-4 border">2024-03-12 14:30:00</td>
                                <td className="py-2 px-4 border">$150.00</td>
                                <td className="py-2 px-4 border">Pendiente</td>
                                <td className="py-2 px-4 border">Paypal</td>
                                <td className="py-2 px-4 border flex space-x-2">
                                    <button className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                                    <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => deleteProduct()}>Delete</button>
                                    <button className="bg-green-500 text-white px-3 py-1 rounded">Change Status</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Modo Tarjetas en pantallas pequeñas */}
                <div className="md:hidden space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow text-center">
                        <p><strong>ID:</strong> 1</p>
                        <p><strong>Client Name:</strong> John Doe</p>
                        <p><strong>Client Email:</strong> john@example.com</p>
                        <p><strong>Order Date:</strong> 2024-03-12 14:30:00</p>
                        <p><strong>Total:</strong> $150.00</p>
                        <p><strong>Status:</strong> Pendiente</p>
                        <p><strong>Payment Method:</strong> Paypal</p>
                        <div className="mt-4 flex justify-center space-x-4">
                            <button className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                            <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => deleteProduct()}>Delete</button>
                            <button className="bg-green-500 text-white px-3 py-1 rounded">Change Status</button>
                        </div>
                    </div>
                </div>

                {/* Botón Add Order */}
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded" onClick={redirectToAddOrder}>Add Order</button>
            </div>
        </div>
    );
}
