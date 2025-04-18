import { useState } from "react";
import { appRoutesAdmin } from "../routes/routes";
import { Link } from 'react-router-dom';

export function SidebarAdmin() {
    const [menuOpen, setMenuOpen] = useState(false);
    return <div> <div className={`w-64 bg-blue-900 text-white p-5 fixed md:static top-0 left-0 h-full transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0`}>
        <button className="md:hidden text-white text-xl absolute top-2 right-4" onClick={() => setMenuOpen(false)}>✖</button>
        <h2 className="text-2xl font-bold mb-5">Admin Panel</h2>
        <ul>
            {appRoutesAdmin.map(route => (
                <li className="mb-2 py-2 px-4 hover:bg-blue-700 rounded cursor-pointer transition duration-200" key={route.name}>
                    <Link className="block w-full h-full text-white" to={route.path}>
                        {route.name}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
        <button className={`md:hidden absolute top-16 left-0 text-blue-900 text-2xl p-2 border-2 border-gray-400 rounded bg-gray-200 ${menuOpen ? "hidden" : ""}`} onClick={() => setMenuOpen(true)}>☰</button>
    </div>;
}