import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/ModalContext";
import { SidebarAdmin } from "../../../components/sidebaradmin";
import { toast } from "react-toastify";
import { useGuardToken } from "../../../utils/guard";   // ⬅️ nuevo
import { useAuth } from "../../../context/AuthContext";

export function MessagesPanel() {
  const [messages, setMessages] = useState([]);
  const { openModal } = useModal();
  const navigate = useNavigate();

  const guard = useGuardToken();                   // ⬅️ hook de protección
  const { logout } = useAuth();                   // solo necesitamos logout
  const token = localStorage.getItem("token");    // si tu API necesita header

  /* ───────────── carga inicial ───────────── */
  useEffect(() => {
    if (guard()) return;                          // corta si expiró

    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/messages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    })();
  }, []);

  /* ───────────── acciones ───────────── */
  const deleteMessage = async (id) => {
    if (guard()) return;

    const confirm = await openModal({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this message?",
    });
    if (!confirm) return;

    try {
      await fetch(`http://localhost:5000/api/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  /* ───────────── UI ───────────── */
  return (
    <div className="flex min-h-[90vh] bg-gray-100">
      <SidebarAdmin />

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold mb-6 text-center">Messages</h1>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 text-sm md:text-base">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Message</th>
                <th className="py-2 px-4 border">Created At</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id}>
                  <td className="py-2 px-4 border">{msg.id}</td>
                  <td className="py-2 px-4 border">{msg.name}</td>
                  <td className="py-2 px-4 border">{msg.email}</td>
                  <td className="py-2 px-4 border">{msg.message}</td>
                  <td className="py-2 px-4 border">
                    {new Date(msg.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => deleteMessage(msg.id)}
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
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white p-4 rounded-lg shadow">
              <p><strong>Name:</strong> {msg.name}</p>
              <p><strong>Email:</strong> {msg.email}</p>
              <p><strong>Message:</strong> {msg.message}</p>
              <p><strong>Date:</strong> {new Date(msg.createdAt).toLocaleString()}</p>
              <div className="mt-4">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deleteMessage(msg.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            logout();
            navigate("/admin");
            toast.success("Sesión cerrada exitosamente");
          }}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
        >
          Close Session
        </button>
      </div>
    </div>
  );
}
