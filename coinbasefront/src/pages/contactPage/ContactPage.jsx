import { useState } from "react";
import { toast } from "react-toastify";

export function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, message } = formData;

        if (!name || !email || !message) {
            toast.error("All fields are required.");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            toast.success("Your message has been sent!");
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            console.error("Error sending contact message:", error);
            toast.error("Something went wrong. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            rows="5"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
}
