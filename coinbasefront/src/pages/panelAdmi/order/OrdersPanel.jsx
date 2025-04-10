import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { appRoutesAdmin } from "../../../routes/routes";
import { useModal } from "../../../context/ModalContext";

export function OrdersPanel() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { openModal } = useModal();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/orders");
                const data = await res.json();
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    const deleteOrder = async (id) => {
        const confirm = await openModal({
            title: "Confirm Deletion",
            text: "Are you sure you want to delete this order?",
        });

        if (confirm) {
            try {
                await fetch(`http://localhost:5000/api/orders/${id}`, {
                    method: "DELETE",
                });
                setOrders(orders.filter(order => order.id !== id));
            } catch (error) {
                console.error("Error deleting order:", error);
            }
        }
    };


    const redirectToAddOrder = () => {
        navigate("/admin/orders/add");  
    };

    const handleGoEdit = (product) => {
        navigate(`/admin/orders/edit`, { state: { product } });
    };



    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`w-64 bg-blue-900 text-white p-5 fixed md:static top-0 left-0 h-full transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
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

            {/* Botón menú mobile */}
            <button className={`md:hidden absolute top-16 left-0 text-blue-900 text-2xl p-2 border-2 border-gray-400 rounded bg-gray-200 ${menuOpen ? "hidden" : ""}`} onClick={() => setMenuOpen(true)}>☰</button>

            {/* Contenido Principal */}
            <div className="flex-1 p-6">
                <h1 className="text-3xl font-semibold mb-6 text-center">Orders Management</h1>

                {/* Tabla para escritorio */}
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
                                <th className="py-2 px-4 border">Payment</th>
                                <th className="py-2 px-4 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td className="py-2 px-4 border">{order.id}</td>
                                    <td className="py-2 px-4 border">{order.client_name}</td>
                                    <td className="py-2 px-4 border">{order.client_email}</td>
                                    <td className="py-2 px-4 border">{new Date(order.order_date).toLocaleString()}</td>
                                    <td className="py-2 px-4 border">${order.total}</td>
                                    <td className="py-2 px-4 border">{order.status}</td>
                                    <td className="py-2 px-4 border">{order.payment?.method}</td>
                                    <td className="py-2 px-4 border flex justify-center items-center space-x-2">
                                        <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => handleGoEdit(order)}>Edit</button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => deleteOrder(order.id)}>Delete</button>
                                        <button className="bg-green-500 text-white px-3 py-1 rounded">Change Status</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Tarjetas para mobile */}
                <div className="md:hidden space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-4 rounded-lg shadow text-center">
                            <p><strong>ID:</strong> {order.id}</p>
                            <p><strong>Client Name:</strong> {order.client_name}</p>
                            <p><strong>Client Email:</strong> {order.client_email}</p>
                            <p><strong>Order Date:</strong> {order.order_date}</p>
                            <p><strong>Total:</strong> ${order.total}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                            <p><strong>Payment Method:</strong> {order.payment?.method}</p>
                            <div className="mt-4 flex justify-center space-x-4">
                                <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => handleGoEdit(order)}>Edit</button>
                                <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => deleteOrder(order.id)}>Delete</button>
                                <button className="bg-green-500 text-white px-3 py-1 rounded">Change Status</button>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded" onClick={redirectToAddOrder}>
                    Add Order
                </button>
            </div>
        </div>
    );
}
