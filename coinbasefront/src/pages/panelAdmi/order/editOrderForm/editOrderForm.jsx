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
        id_payment: "",
    });

    useEffect(() => {
        if (order) {
            setOrderData({
                client_name: order.client_name || "",
                client_email: order.client_email || "",
                order_date: order.order_date || "",
                total: order.total || "",
                status: order.status || "pending",
                payment_method: order.payment?.method || "",
                id_payment: order.payment?.id || "",
            });
        }
    }, [order]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`http://localhost:5000/api/orders/${order.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
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
