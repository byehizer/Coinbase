import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { appRoutesAdmin } from "../../../routes/routes";
import { useModal } from "../../../context/ModalContext";

export function MessagesPanel() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const { openModal } = useModal();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/messages");
                const data = await res.json();
                setMessages(data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, []);

    const deleteMessage = async (id) => {
        const confirm = await openModal({
            title: "Confirm Deletion",
            text: "Are you sure you want to delete this message?",
        });

        if (confirm) {
            try {
                await fetch(`http://localhost:5000/api/messages/${id}`, {
                    method: "DELETE",
                });
                setMessages(messages.filter(message => message.id !== id));
            } catch (error) {
                console.error("Error deleting message:", error);
            }
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`w-64 bg-blue-900 text-white p-5 fixed md:static top-0 left-0 h-full transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
                <button className="md:hidden text-white text-xl absolute top-2 right-4" onClick={() => setMenuOpen(false)}>✖</button>
                <h2 className="text-2xl font-bold mb-5">Admin Panel</h2>
                <ul>
                    {appRoutesAdmin.map(route => (
                        <li className="mb-2 py-2 px-4 hover:bg-blue-700 rounded cursor-pointer transition duration-200" key={route.name}>
                            <Link className="block w-full h-full text-white" to={route.path} onClick={() => setMenuOpen(false)}>
                                {route.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <button className={`md:hidden absolute top-16 left-0 text-blue-900 text-2xl p-2 border-2 border-gray-400 rounded bg-gray-200 ${menuOpen ? "hidden" : ""}`} onClick={() => setMenuOpen(true)}>☰</button>

            {/* Main content */}
            <div className="flex-1 p-6">
                <h1 className="text-3xl font-semibold mb-6 text-center">Messages</h1>

                {/* Desktop Table */}
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
                            {messages.map(msg => (
                                <tr key={msg.id}>
                                    <td className="py-2 px-4 border">{msg.id}</td>
                                    <td className="py-2 px-4 border">{msg.name}</td>
                                    <td className="py-2 px-4 border">{msg.email}</td>
                                    <td className="py-2 px-4 border">{msg.message}</td>
                                    <td className="py-2 px-4 border">{new Date(msg.createdAt).toLocaleString()}</td>
                                    <td className="py-2 px-4 border">
                                        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => deleteMessage(msg.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className="bg-white p-4 rounded-lg shadow">
                            <p><strong>Name:</strong> {msg.name}</p>
                            <p><strong>Email:</strong> {msg.email}</p>
                            <p><strong>Message:</strong> {msg.message}</p>
                            <p><strong>Date:</strong> {new Date(msg.createdAt).toLocaleString()}</p>
                            <div className="mt-4">
                                <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => deleteMessage(msg.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
