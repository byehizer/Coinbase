import { useLocation, useNavigate } from "react-router-dom";
import ordersData from "../orders.json";
import { useEffect, useState } from "react";

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export default function OrderDetailPage() {
  const query = useQuery();
  const navigate = useNavigate();
  const orderId = query.get("id");
  const location = useLocation();

  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate("/track-order");
    }
  }, [orderId, navigate]);

  if (!order) return null;

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] text-white">
      <div className="w-full max-w-2xl p-6 border border-gray-700 rounded-xl shadow-lg bg-gray-800">
        <h2 className="text-xl font-bold mb-4 text-center">
          Información del Pedido
        </h2>
        <p>
          <strong>ID:</strong> {order.id}
        </p>
        <p>
          <strong>Email:</strong> {order.clientEmail}
        </p>
        <p>
          <strong>Estado:</strong> {order.status}
        </p>
        <p>
          <strong>Fecha:</strong> {order.orderDate}
        </p>
        <p>
          <strong>Payment method:</strong> {order.paymentMethod}
        </p>
        {order.trackingStatus && (
          <p>
            <strong>Tracking:</strong> {order.trackingStatus}
          </p>
        )}
        <p className="mt-4 font-semibold">Productos:</p>
        <ul className="space-y-4 mt-2">
          {order.products.map((prod, i) => (
            <li
              key={i}
              className="flex items-center gap-4 bg-gray-600 p-3 rounded-lg shadow-sm"
            >
              <img
                src={`http://localhost:5000${prod.image}`}
                alt={prod.name}
                className="w-32 h-32 object-contain rounded"
              />
              <div>
                <p className="font-medium">
                  {prod.quantity}x {prod.name}
                </p>
                <p className="text-xl text-white">${prod.unitPrice}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-xl font-semibold mt-2">
          Total: <span className="text-green-400">${order.total}</span>
        </p>

        {["Zelle", "Venmo"].includes(order.paymentMethod) && (
          <div className="mt-6 bg-gray-700 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold mb-2">Upload receipt</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Comprobante enviado (simulado)");
              }}
            >
              <input
                type="file"
                accept="image/*,application/pdf"
                required
                className="block w-full mb-4 p-2 border border-gray-500 rounded bg-gray-800 text-white"
              />
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-white text-gray-900 p-2 rounded hover:bg-gray-200 font-semibold"
                >
                  Enviar comprobante
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
