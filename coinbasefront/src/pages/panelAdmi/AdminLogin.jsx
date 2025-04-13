import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();



    const handleSubmit = (e) => {
        e.preventDefault();
        const success = login(password);
        if (success) {
            navigate('/admin/products');
        } else {
            setError('Contraseña incorrecta');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-semibold mb-4 text-center">Login Admin</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded mb-4 bg-gray-700 border border-gray-600 text-white"
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 rounded mb-4 bg-gray-700 border border-gray-600 text-white"
                    required
                />

                {error && <p className="text-red-400 mb-2">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-white text-black p-2 rounded hover:bg-gray-300 font-semibold"
                >
                    Ingresar
                </button>
            </form>
        </div>
    );
}
