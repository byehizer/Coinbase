import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export function EditOrderForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const order = location.state?.product || {};

    const [orderData, setOrderData] = useState({
        client_name: "",
        client_email: "",
        order_date: "",
        total: "",
        status: "pending",
        payment_method: "",
        payment_status: "pending", 
        id_payment: "",
    });

    const [receipt, setReceipt] = useState(null); 
    const [existingReceipt, setExistingReceipt] = useState(null); 


    useEffect(() => {
        if (order) {
            setOrderData({
                client_name: order.client_name || "",
                client_email: order.client_email || "",
                order_date: order.order_date || "",
                total: order.total || "",
                status: order.status || "pending",
                payment_method: order.payment?.method || "",
                payment_status: order.payment?.status || "pending",
                id_payment: order.payment?.id || "",
            });

            if (order.payment?.receipt) {
                setExistingReceipt(`http://localhost:5000${order.payment.receipt}`)
            }
        }
    }, [order]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderData(prev => ({ ...prev, [name]: value }));
    };


    const handleReceiptChange = (e) => {
        setReceipt(e.target.files[0]);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("client_name", orderData.client_name);
            formData.append("client_email", orderData.client_email);
            formData.append("order_date", orderData.order_date);
            formData.append("total", Number(orderData.total));
            formData.append("status", orderData.status);
            formData.append("payment_method", orderData.payment_method);
            formData.append("id_payment", parseInt(orderData.id_payment));
            formData.append("payment_status", orderData.payment_status);

            if (receipt) {
                formData.append("receipt", receipt);
            }

            const res = await fetch(`http://localhost:5000/api/orders/${order.id}`, {
                method: "PUT",
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to update");

            toast.success("Order updated successfully!");
            navigate("/admin/orders");
        } catch (err) {
            console.error(err);
            toast.error("Error updating order.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl bg-white p-8 shadow-md rounded-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Edit Order</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Client Name</label>
                        <input
                            type="text"
                            name="client_name"
                            value={orderData.client_name}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Client Email</label>
                        <input
                            type="email"
                            name="client_email"
                            value={orderData.client_email}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Order Date</label>
                        <input
                            type="date"
                            name="order_date"
                            value={orderData.order_date}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Total</label>
                        <input
                            type="number"
                            name="total"
                            value={orderData.total}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Status</label>
                        <select
                            name="status"
                            value={orderData.status}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Payment Method</label>
                        <select
                            name="payment_method"
                            value={orderData.payment_method}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        >
                            <option value="">Select a method</option>
                            <option value="PayPal">PayPal</option>
                            <option value="Venmo">Venmo</option>
                            <option value="Zelle">Zelle</option>
                            <option value="Credit_Card">Credit Card</option>
                            <option value="Debit_Card">Debit Card</option>
                            <option value="Apple_Pay">Apple Pay</option>
                            <option value="Google_Pay">Google Pay</option>
                            <option value="Cripto">Crypto</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Payment Status</label>
                        <select
                            name="payment_status"
                            value={orderData.payment_status}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        >
                            <option value="">Select a status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

        
                    
                    <div>
                        <label className="block text-sm font-medium">Receipt (optional)</label>
                        {existingReceipt && (
                            <div className="mb-2">
                                <img
                                    src={existingReceipt}
                                    alt="Current Receipt"
                                    className="max-w-lg max-h-72 rounded shadow-md border"
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleReceiptChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>


                    <div className="flex justify-between mt-6">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
                            Save Changes
                        </button>
                        <button type="button" onClick={() => navigate("/admin/orders")} className="bg-gray-500 text-white px-6 py-2 rounded">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
