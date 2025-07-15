import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/ModalContext";
import { useAuth } from "../../../context/AuthContext";
import { SidebarAdmin } from "../../../components/sidebaradmin";
import { toast } from "react-toastify";

export function OrdersPanel() {
  const [orders, setOrders] = useState([]);
  const { openModal } = useModal();
  const navigate = useNavigate();
  const { token, logout, isTokenExpired } = useAuth();

  // 🔐 Protección de sesión expirada
  useEffect(() => {
    if (isTokenExpired()) {
      toast.error("Sesión expirada. Por favor inicia sesión nuevamente.", {
        toastId: "expired-session",
      });
      logout();
      navigate("/admin");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          toast.error("Sesión expirada. Por favor inicia sesión nuevamente.", {
            toastId: "expired-session",
          });
          logout();
          navigate("/admin");
          return;
        }

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  const deleteOrder = async (id) => {
    const confirm = await openModal({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this order?",
    });

    if (!confirm) return;

    if (isTokenExpired()) {
      toast.error("Sesión expirada. Por favor inicia sesión nuevamente.", {
        toastId: "expired-session",
      });
      logout();
      navigate("/admin");
      return;
    }

    try {
      await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const redirectToAddOrder = () => {
    if (isTokenExpired()) {
      toast.error("Sesión expirada. Por favor inicia sesión nuevamente.", {
        toastId: "expired-session",
      });
      logout();
      navigate("/admin");
      return;
    }
    navigate("/admin/orders/add");
  };

  const handleGoEdit = (order) => {
    if (isTokenExpired()) {
      toast.error("Sesión expirada. Por favor inicia sesión nuevamente.", {
        toastId: "expired-session",
      });
      logout();
      navigate("/admin");
      return;
    }
    navigate(`/admin/orders/edit`, { state: { product: order } });
  };

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
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="py-2 px-4 border">{order.id}</td>
                  <td className="py-2 px-4 border">{order.client_name}</td>
                  <td className="py-2 px-4 border">{order.client_email}</td>
                  <td className="py-2 px-4 border">
                    {new Date(order.order_date).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border">${order.total}</td>
                  <td className="py-2 px-4 border">{order.status}</td>
                  <td className="py-2 px-4 border">{order.payment?.method}</td>
                  <td className="py-2 px-4 border flex justify-center items-center space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => handleGoEdit(order)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => deleteOrder(order.id)}
                    >
                      Delete
                    </button>
                    <button className="bg-green-500 text-white px-3 py-1 rounded">
                      Change Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow text-center">
              <p><strong>ID:</strong> {order.id}</p>
              <p><strong>Client Name:</strong> {order.client_name}</p>
              <p><strong>Client Email:</strong> {order.client_email}</p>
              <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleString()}</p>
              <p><strong>Total:</strong> ${order.total}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Payment Method:</strong> {order.payment?.method}</p>
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => handleGoEdit(order)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deleteOrder(order.id)}
                >
                  Delete
                </button>
                <button className="bg-green-500 text-white px-3 py-1 rounded">
                  Change Status
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mr-4"
            onClick={redirectToAddOrder}
          >
            Add Order
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => {
              logout();
              navigate("/admin");
              toast.success("Sesión cerrada exitosamente");
            }}
          >
            Close Session
          </button>
        </div>
      </div>
    </div>
  );
}
