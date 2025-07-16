import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/ModalContext";
import { SidebarAdmin } from "../../../components/sidebaradmin";
import { toast } from "react-toastify";
import { useGuardToken } from "../../../utils/guard";   // ⬅️ nuevo hook
import { useAuth } from "../../../context/AuthContext";

export function OrdersPanel() {
  const [orders, setOrders] = useState([]);
  const { openModal } = useModal();
  const navigate = useNavigate();
  const guard = useGuardToken();                                // ⬅️ instanciamos guard
  const { logout } = useAuth();
  const token = localStorage.getItem("token");                // si aún lo necesitás para headers

  /* ──────────────────── cargar órdenes ──────────────────── */
  useEffect(() => {
    if (guard()) return;                                        // corta si sesión expirada

    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) { guard(); return; }            // por si expira justo ahora
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      }
    })();
  }, []);

  /* ──────────────────── acciones ──────────────────── */
  const deleteOrder = async (id) => {
    if (guard()) return;

    const confirm = await openModal({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this order?",
    });
    if (!confirm) return;

    try {
      await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  const redirectToAddOrder = () => {
    if (guard()) return;
    navigate("/admin/orders/add");
  };

  const handleGoEdit = (order) => {
    if (guard()) return;
    navigate(`/admin/orders/edit`, { state: { order: order } });
  };

 /* …imports y lógica previa idénticos… */

  /* ──────────────────── UI ──────────────────── */
  return (
    <div className="flex min-h-[120vh] bg-gray-100">
      <SidebarAdmin />

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Orders Management
        </h1>

        {/* Tabla escritorio */}
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
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="py-2 px-4 border">{o.id}</td>
                  <td className="py-2 px-4 border">{o.client_name}</td>
                  <td className="py-2 px-4 border">{o.client_email}</td>
                  <td className="py-2 px-4 border">
                    {new Date(o.order_date).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border">${o.total}</td>
                  <td className="py-2 px-4 border">{o.status}</td>
                  <td className="py-2 px-4 border">{o.payment?.method}</td>
                  <td className="py-2 px-4 border flex gap-2 justify-center">
                    {/* View Details */}
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => handleGoEdit(o)}
                    >
                      View Details
                    </button>
                    {/* Delete */}
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => deleteOrder(o.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white p-4 rounded-lg shadow text-center"
            >
              <p><strong>ID:</strong> {o.id}</p>
              <p><strong>Client Name:</strong> {o.client_name}</p>
              <p><strong>Client Email:</strong> {o.client_email}</p>
              <p><strong>Order Date:</strong> {new Date(o.order_date).toLocaleString()}</p>
              <p><strong>Total:</strong> ${o.total}</p>
              <p><strong>Status:</strong> {o.status}</p>
              <p><strong>Payment:</strong> {o.payment?.method}</p>
              <div className="mt-4 flex gap-3 justify-center">
                {/* View Details */}
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => handleGoEdit(o)}
                >
                  View Details
                </button>
                {/* Delete */}
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deleteOrder(o.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Botones inferiores */}
        <div className="mt-6 flex flex-wrap gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={redirectToAddOrder}
          >
            Add Order
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => {
              logout();
              toast.success("Sesión cerrada exitosamente");
              navigate("/admin");
            }}
          >
            Close Session
          </button>
        </div>
      </div>
    </div>
  );
}

