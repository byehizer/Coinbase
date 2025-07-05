import { useState } from "react";
import ordersData from "../orders.json";
import { useNavigate, useLocation } from "react-router-dom";

export default function TrackOrderPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [orderIdInput, setOrderIdInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderIdInput.trim()}`
      );

      if (!response.ok) {
        setError("Pedido no encontrado.");
        return;
      }

      const found = await response.json();

      if (found.clientEmail.toLowerCase() === email.toLowerCase().trim()) {
        navigate(`/order-detail?id=${found.id}`, { state: { order: found } });
      } else {
        setError("El correo no coincide con el ID del pedido.");
      }
    } catch (error) {
      console.error("Error buscando el pedido:", error);
      setError("Ocurrió un error al buscar el pedido.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] text-white">
      <div
        className={`w-full  max-w-[32rem] p-6 border border-gray-700 rounded-xl shadow-lg bg-gray-800`}
      >
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Rastrear Pedido
        </h1>
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
      </div>
    </div>
  );
}
