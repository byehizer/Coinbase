import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useShoppingCart } from "../context/shoppingcartcontext";

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export default function OrderDetailPage() {
  const query = useQuery();
  const navigate = useNavigate();
  const location = useLocation();

  const orderId = query.get("id");
  const order = location.state?.order;

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState(order?.receipt || null);

  useEffect(() => {
    if (!order) {
      navigate("/track-order");
    }
  }, [order, navigate]);

  if (!order) return null;

  const canUploadReceipt =
    ["zelle", "venmo"].includes(order.paymentMethod?.toLowerCase()) &&
    order.status === "pending";

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("email", order.clientEmail);
      formData.append("image", file); // <-- debe coincidir con backend

      const res = await fetch(
        `http://localhost:5000/api/orders/${order.id}/upload-receipt`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      toast.success("Receipt uploaded successfully");
      setReceiptUrl(`${data.receipt}`);
      setFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Error uploading receipt");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] text-white">
      <div className="w-full max-w-2xl p-6 border border-gray-700 rounded-xl shadow-lg bg-gray-800">
        <h2 className="text-xl font-bold mb-4 text-center">Order Details</h2>

        <p><strong>ID:</strong> {order.id}</p>
        <p><strong>Email:</strong> {order.clientEmail}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Date:</strong> {order.orderDate}</p>
        <p><strong>Payment method:</strong> {order.paymentMethod}</p>

        {order.trackingStatus && (
          <p><strong>Tracking:</strong> {order.trackingStatus}</p>
        )}

        <p className="mt-4 font-semibold">Products:</p>
        <ul className="space-y-4 mt-2">
          {order.products.map((prod, i) => (
            <li
              key={i}
              className="flex items-center gap-4 bg-gray-600 p-3 rounded-lg shadow-sm"
            >
              <img
                src={`${prod.image}`}
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

        {["zelle", "venmo"].includes(order.paymentMethod?.toLowerCase()) && (
          <div className="mt-6 bg-gray-700 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold mb-2">Upload Receipt</h3>

            {receiptUrl && (
              <div className="mb-4">
                <p className="text-sm text-green-300">Receipt uploaded:</p>
                <a
                  href={receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-400"
                >
                  View uploaded receipt
                </a>
              </div>
            )}

            {!canUploadReceipt ? (
              <p className="text-yellow-400">
                Upload not allowed. Order status: <b>{order.status}</b>
              </p>
            ) : (
              <form onSubmit={handleUpload}>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  required
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full mb-4 p-2 border border-gray-500 rounded bg-gray-800 text-white"
                  disabled={uploading}
                />
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-white text-gray-900 p-2 rounded hover:bg-gray-200 font-semibold"
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Send Receipt"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
