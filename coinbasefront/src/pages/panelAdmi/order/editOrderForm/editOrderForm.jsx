import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useModal } from "../../../../context/ModalContext";
import { useGuardToken } from "../../../../utils/guard";

export default function EditOrderForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const guard = useGuardToken();
  const { openModal } = useModal();
  const [originalOrder, setOriginalOrder] = useState(null);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    if (guard()) return;

    const id = location.state?.order?.id;
    if (!id) {
      toast.error("Order not found");
      navigate("/admin/orders");
      return;
    }

    (async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) return guard();
        const d = await res.json();
        setOriginalOrder({ ...d });
        setIsReadOnly(["cancelled", "delivered"].includes(d.status));

        // Flatten delivery y tracking
        setOrder({
          ...d,
          address: d.address || "",
          city: d.city || "",
          country: d.country || "",
          trackingStatus: d.trackingStatus || "",
          receipt: d.receipt || null,
        });
      } catch {
        toast.error("Error loading order");
        navigate("/admin/orders");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (guard() || loading || !order) return null;

  /* ─── Helpers ─── */
  const setField = (field, value) =>
    setOrder((prev) => ({ ...prev, [field]: value }));

  /* ─── PUT /orders/:id_order ─── */

  const validateOrder = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const {
      clientName,
      clientEmail,
      status,
      trackingStatus,
      address,
      city,
      country,
    } = order;

    if (!clientName.trim()) return "Client name is required.";
    if (!clientEmail.trim()) return "Client email is required.";
    if (!emailRegex.test(clientEmail)) return "Client email is invalid.";
    if (
      !["pending", "paid", "shipped", "delivered", "cancelled"].includes(status)
    )
      return "Invalid order status.";

    if (
      ["pending", "cancelled"].includes(status) &&
      trackingStatus !== "pending"
    )
      return "Tracking status cannot be changed while order is pending or cancelled.";

    if (["shipped", "delivered"].includes(status)) {
      if (!address.trim()) return "Address is required for shipping.";
      if (!city.trim()) return "City is required for shipping.";
      if (!country.trim()) return "Country is required for shipping.";
    }

    return null;
  };
  const goBack = () =>{
    navigate(-1);
    return;
  }

  const updateOrder = async () => {
    if (guard()) return;

    const error = validateOrder();
    if (error) {
      toast.error(error);
      return;
    }

    const body = {
      clientName: order.clientName,
      clientEmail: order.clientEmail,
      status: order.status,
      trackingStatus: order.trackingStatus,
      deliveryAddress: order.address,
      deliveryCity: order.city,
      deliveryCountry: order.country,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.status === 401) return guard();

      const responseBody = await res.json();

      if (!res.ok) {
        const message =
          responseBody.error || responseBody.message || "Update failed";
        toast.error(message);
        return;
      }

      const u = responseBody;

      setOrder({
        ...u,
        address: u.address || "",
        city: u.city || "",
        country: u.country || "",
        trackingStatus: u.trackingStatus || "",
        receipt: u.receipt || null,
      });

      toast.success("Order updated");
      setTimeout(() => {
        navigate("/admin/orders");
      }, 1500);
    } catch (err) {
      toast.error("Update failed");
      console.error(err); // opcional, útil para debug
    }
  };

  /* ─── PATCH accept / reject / refund (sin cambios) ─── */
  const patchAction = async (action) => {
    if (guard()) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${order.id}/${action}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 401) return guard();

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Error trying to ${action}`);
      }

      const u = await res.json();
      setOrder({
        ...u,
        address: u.address || "",
        city: u.city || "",
        country: u.country || "",
        trackingStatus: u.trackingStatus || "",
        receipt: u.receipt || null,
      });
      toast.success(`Order ${action}ed`);
      setTimeout(() => {
        navigate("/admin/orders");
      }, 1500);
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const confirmAndAct = async (action, title, text) => {
    if (guard()) return;
    const confirmed = await openModal({ title, text });
    if (!confirmed) return;

    if (action === "delete") {
      try {
        const res = await fetch(
          `http://localhost:5000/api/orders/${order.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.status === 401) return guard();
        if (!res.ok) throw new Error(await res.text());
        toast.success("Order deleted");
        setTimeout(() => {
          navigate("/admin/orders");
        }, 1500);
      } catch {
        toast.error("Error deleting order");
      }
    } else {
      patchAction(action);
    }
  };

  /* ─── lógica de botones ─── */
  const isVenmoZelle = ["venmo", "zelle"].includes(
    originalOrder?.paymentMethod?.toLowerCase()
  );

  const showAcceptReject = originalOrder?.status === "pending" && isVenmoZelle;

  const showRefund = originalOrder?.status === "paid" && !isVenmoZelle;

  const showDelete = originalOrder?.status === "cancelled";

  /* ─── UI ─── */
  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-300 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Order #{order.id}</h2>

      <div className="grid gap-4">
        {/* Cliente */}
        <label>
          Client Name:
          <input
            className="w-full border p-2 rounded"
            value={order.clientName}
            onChange={(e) => setField("clientName", e.target.value)}
            disabled={isReadOnly}
          />
        </label>
        <label>
          Client Email:
          <input
            className="w-full border p-2 rounded"
            value={order.clientEmail}
            onChange={(e) => setField("clientEmail", e.target.value)}
            disabled={isReadOnly}
          />
        </label>

        {/* Dirección */}
        <label>
          Address:
          <input
            className="w-full border p-2 rounded"
            value={order.address}
            onChange={(e) => setField("address", e.target.value)}
            disabled={isReadOnly}
          />
        </label>
        <label>
          City:
          <input
            className="w-full border p-2 rounded"
            value={order.city}
            onChange={(e) => setField("city", e.target.value)}
            disabled={isReadOnly}
          />
        </label>
        <label>
          Country:
          <input
            className="w-full border p-2 rounded"
            value={order.country}
            onChange={(e) => setField("country", e.target.value)}
            disabled={isReadOnly}
          />
        </label>

        {/* Estados */}
        <label>
          Order Status:
          <select
            className="w-full border p-2 rounded"
            value={order.status}
            onChange={(e) => setField("status", e.target.value)}
            disabled={isReadOnly}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>

        <label>
          Tracking Status:
          <select
            className="w-full border p-2 rounded"
            value={order.trackingStatus}
            onChange={(e) => setField("trackingStatus", e.target.value)}
            disabled={isReadOnly || order.status === "pending"}
          >
            <option value="">--</option>
            <option value="pending">Pending</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>
        </label>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Products:</h3>
          <ul className="space-y-4">
            {order.products?.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-4 border p-2 rounded bg-white"
              >
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Unit Price: ${item.unitPrice}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Comprobante de pago */}
        {order.receipt && isVenmoZelle && (
          <div className="flex flex-col items-center mt-6 bg-white">
            <h3 className="font-semibold mb-2">Payment Receipt:</h3>

            {order.receipt.endsWith(".pdf") ? (
              <a
                href={`http://localhost:5000${order.receipt}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Ver comprobante PDF
              </a>
            ) : (
              <a
                href={`http://localhost:5000${order.receipt}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`http://localhost:5000${order.receipt}`}
                  alt="receipt"
                  className="max-w-sm max-h-50 border rounded shadow-md "
                />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={isReadOnly ? goBack : updateOrder}
        >
          {`${isReadOnly ? "Volver" : "Save Changes"}`}
        </button>

        {showAcceptReject && (
          <>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => patchAction("accept")}
            >
              Accept
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={() =>
                confirmAndAct("reject", "Reject Order", "Are you sure?")
              }
            >
              Reject
            </button>
          </>
        )}

        {showRefund && (
          <button
            className="bg-yellow-600 text-white px-4 py-2 rounded"
            onClick={() =>
              confirmAndAct("refund", "Refund Order", "Initiate refund?")
            }
          >
            Refund
          </button>
        )}
        {showDelete && (
          <button
            className="bg-red-800 text-white px-4 py-2 rounded"
            onClick={() =>
              confirmAndAct(
                "delete",
                "Delete Order",
                "Are you sure you want to permanently delete this order?"
              )
            }
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
