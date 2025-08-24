import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AddOrdersForm() {
    const [formData, setFormData] = useState({
        client_name: "",
        client_email: "",
        order_date: "",
        total: "",
        status: "pending",
        method_payment: "",
        address: "",
        city: "",
        country: "",
    });

    const [receipt, setReceipt] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setReceipt(e.target.files[0] || null);
    };

    const handleGoBack = () => navigate("/admin/orders");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const deliveryRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/deliveries`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    address: formData.address,
                    city: formData.city,
                    country: formData.country,
                }),
            });
            const deliveryData = await deliveryRes.json();
            console.log("Delivery response:", deliveryData);
            if (!deliveryRes.ok) throw new Error(deliveryData.message);

 
            const paymentFormData = new FormData();
            paymentFormData.append("method", formData.method_payment);
            if (receipt) paymentFormData.append("receipt", receipt);

            const paymentRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payments`, {
                method: "POST",
                body: paymentFormData,
            });
            const paymentData = await paymentRes.json();
            console.log("Payment response:", paymentData);
            if (!paymentRes.ok) throw new Error(paymentData.message);

            const orderRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    client_name: formData.client_name,
                    client_email: formData.client_email,
                    order_date: new Date(formData.order_date),
                    total: parseFloat(formData.total),
                    status: formData.status,
                    id_delivery: deliveryData.delivery.id,
                    id_payment: paymentData.payment.id,
                }),
            });

            if (orderRes.ok) {
                alert("Order created successfully!");
                navigate("/admin/orders");
            } else {
                const error = await orderRes.json();
                throw new Error(error.message || "Error creating order");
            }
        } catch (err) {
            console.error(err);
            alert(`Error: ${err.message}`);
        }
    };

    return (
        <div className="flex justify-center items-start min-h-screen bg-white sm:bg-gray-100">
            <div className="w-full max-w-lg sm:max-w-2xl bg-white p-8 shadow-md rounded-md mt-12">
                <h2 className="text-2xl font-bold mb-6 text-center">Add New Order</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                
                    <h3 className="text-lg font-semibold mb-2 mt-4 border-b pb-1">Client Information</h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Client Name</label>
                        <input type="text" name="client_name" value={formData.client_name} onChange={handleChange}
                            className="mt-2 p-2 w-full border border-gray-300 rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Client Email</label>
                        <input type="email" name="client_email" value={formData.client_email} onChange={handleChange}
                            className="mt-2 p-2 w-full border border-gray-300 rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Order Date</label>
                        <input type="datetime-local" name="order_date" value={formData.order_date} onChange={handleChange}
                            className="mt-2 p-2 w-full border border-gray-300 rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Total</label>
                        <input type="number" name="total" value={formData.total} onChange={handleChange}
                            className="mt-2 p-2 w-full border border-gray-300 rounded" required />
                    </div>

                    
                    <h3 className="text-lg font-semibold mb-2 mt-6 border-b pb-1">Delivery Information</h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="mt-2 p-2 w-full border border-gray-300 rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange}
                            className="mt-2 p-2 w-full border border-gray-300 rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Country</label>
                        <input type="text" name="country" value={formData.country} onChange={handleChange} className="mt-2 p-2 w-full border border-gray-300 rounded" required />
                    </div>

                
                    <h3 className="text-lg font-semibold mb-2 mt-6 border-b pb-1">Payment Information</h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="mt-2 p-2 w-full border border-gray-300 rounded" required>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                        <select name="method_payment" value={formData.method_payment} onChange={handleChange} className="mt-2 p-2 w-full border border-gray-300 rounded" required>
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
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700">Receipt (optional)</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2 w-full" />
                    </div>


                    <div className="flex justify-between">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">Save Order</button>
                        <button type="button" onClick={handleGoBack} className="bg-red-600 text-white px-6 py-2 rounded">Go Back</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
