import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AddOrdersForm() {
    const [orderData, setOrderData] = useState({
        client_name: "",
        client_email: "",
        order_date: "",  
        total: "",
        status: "pendiente",
        method_payment: "", 
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderData({
            ...orderData,
            [name]: value,
        });
    };

    const handleGoBack = () => {
        navigate("/admin/orders");
    };

    return (
        <div className="flex justify-center items-start min-h-screen bg-white sm:bg-gray-100">
            

            <div className="w-full max-w-lg sm:max-w-2xl bg-white p-8 shadow-md rounded-md mt-12">
                <h2 className="text-2xl font-bold mb-6 text-center">Add New Order</h2>
                <form>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Client Name</label>
                        <input
                            type="text"
                            name="client_name"
                            value={orderData.client_name}
                            onChange={handleChange}
                            className="mt-2 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Client Email</label>
                        <input
                            type="email"
                            name="client_email"
                            value={orderData.client_email}
                            onChange={handleChange}
                            className="mt-2 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>


                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Order Date</label>
                        <input
                            type="datetime-local"
                            name="order_date"
                            value={orderData.order_date || new Date().toISOString().slice(0, 16)}
                            onChange={handleChange}
                            className="mt-2 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>


                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Total</label>
                        <input
                            type="number"
                            name="total"
                            value={orderData.total}
                            onChange={handleChange}
                            className="mt-2 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>

                    {/* Campo para el estado de la orden */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            name="status"
                            value={orderData.status}
                            onChange={handleChange}
                            className="mt-2 p-2 w-full border border-gray-300 rounded"
                            required
                        >
                            <option value="pendiente">Pending</option>
                            <option value="pagado">Paid</option>
                            <option value="enviado">Shipped</option>
                            <option value="entregado">Delivered</option>
                        </select>
                    </div>

                    {/* Campo para el método de pago */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                        <select
                            name="method_payment"
                            value={orderData.method_payment}
                            onChange={handleChange}
                            className="mt-2 p-2 w-full border border-gray-300 rounded"
                            required
                        >
                            <option value="credit_card">Credit Card</option>
                            <option value="paypal">PayPal</option>
                            <option value="bank_transfer">Bank Transfer</option>
                            <option value="cash_on_delivery">Cash on Delivery</option>
                        </select>
                    </div>

                    

                    <div className="flex justify-between">
                        <button type="submit"className="bg-blue-600 text-white px-6 py-2 rounded">
                            Save Order
                        </button>
                        <button type="button" onClick={handleGoBack}className="bg-red-600 text-white px-6 py-2 rounded">
                            Go Back
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
