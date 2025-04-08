import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ordersData from '../orders.json';

function useQuery() {
    const { search } = useLocation();
    return new URLSearchParams(search);
}

export default function TrackOrderPage() {
    const query = useQuery();
    const orderIdFromUrl = query.get('id');

    const [email, setEmail] = useState('');
    const [orderIdInput, setOrderIdInput] = useState('');
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const found = ordersData.find(
            (o) => o.id === orderIdInput.trim()
        );

        if (found) {
            if (found.email.toLowerCase() === email.toLowerCase().trim()) {
                setOrder(found);
                setError('');
            } else {
                setError('El correo no coincide con el ID del pedido.');
                setOrder(null);
            }
        } else {
            setError('Pedido no encontrado.');
            setOrder(null);
        }
    };

    useEffect(() => {
        if (orderIdFromUrl) {
            setOrderIdInput(orderIdFromUrl);
        }
    }, [orderIdFromUrl]);

    return (
        <div className="flex justify-center items-center min-h-screen text-white">
            <div className="w-full max-w-2xl p-6 border border-gray-700 rounded-xl shadow-lg bg-gray-800">
                {!order && (
                    <>
                        <h1 className="text-2xl font-semibold mb-4 text-center">Rastrear Pedido</h1>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                type="email"
                                placeholder="Tu correo"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="border border-gray-600 bg-gray-700 text-white p-2 rounded"
                            />
                            <input
                                type="text"
                                placeholder="ID del pedido"
                                value={orderIdInput}
                                onChange={(e) => setOrderIdInput(e.target.value)}
                                required
                                className="border border-gray-600 bg-gray-700 text-white p-2 rounded"
                            />
                            <button
                                type="submit"
                                className="bg-white text-gray-900 p-2 rounded hover:bg-gray-200 font-semibold"
                            >
                                Rastrear pedido
                            </button>
                            {error && <p className="text-red-400">{error}</p>}
                        </form>
                    </>
                )}

                {order && (
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-center">Información del Pedido</h2>
                        <p><strong>ID:</strong> {order.id}</p>
                        <p><strong>Email:</strong> {order.email}</p>
                        <p><strong>Estado:</strong> {order.estado}</p>
                        <p><strong>Fecha:</strong> {order.fechaPedido}</p>
                        {order.trackingNumber && (
                            <p><strong>Tracking:</strong> {order.trackingNumber}</p>
                        )}
                        <p className="mt-4 font-semibold">Productos:</p>
                        <ul className="list-disc list-inside">
                            {order.productos.map((prod, i) => (
                                <li key={i}>
                                    {prod.cantidad}x {prod.nombre} – ${prod.precioUnitario}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
