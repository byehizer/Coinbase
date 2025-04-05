import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { appRoutesAdmin } from "../../../routes/routes";
import { useModal } from "../../../context/ModalContext";

export function ProductsPanel() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { openModal } = useModal();
    const navigate = useNavigate();  
    const [products, setProducts] = useState([]); 

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/products"); 
                const data = await response.json();
                setProducts(data);  
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);



    const handleGoEdit = (product) => {
        navigate(`/admin/products/edit`, { state: { product } });
    };



    const deleteProduct = async (id) => {
        const confirm = await openModal({
            title: "Confirm Deletion",
            text: "Are you sure you want to delete this product?",
        });

        if (confirm) {
            try {
                await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
                setProducts(products.filter(product => product.id !== id));  
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const redirectToAddProduct = () => {
        navigate("/admin/products/add");  
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`w-64 bg-blue-900 text-white p-5 fixed md:static top-0 left-0 h-full transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0`}>
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

            {/* Contenido Principal */}
            <div className="flex-1 p-6">
                <h1 className="text-3xl font-semibold mb-6 text-center">Product Management</h1>

                {/* Tabla de productos */}
                <div className="hidden md:block">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4 border">ID</th>
                                <th className="py-2 px-4 border">Name</th>
                                <th className="py-2 px-4 border">Description</th>
                                <th className="py-2 px-4 border">Year</th>
                                <th className="py-2 px-4 border">Country</th>
                                <th className="py-2 px-4 border">Price</th>
                                <th className="py-2 px-4 border">Stock</th>
                                <th className="py-2 px-4 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td className="py-2 px-4 border">{product.id}</td>
                                    <td className="py-2 px-4 border">{product.name}</td>
                                    <td className="py-2 px-4 border">{product.description}</td>
                                    <td className="py-2 px-4 border">{product.year}</td>
                                    <td className="py-2 px-4 border">{product.country_origin}</td>
                                    <td className="py-2 px-4 border">${product.price}</td>
                                    <td className="py-2 px-4 border">{product.stock}</td>
                                    <td className="py-2 px-4 border flex justify-center items-center space-x-2">
                                        <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => handleGoEdit(product)}>Edit</button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => deleteProduct(product.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button onClick={redirectToAddProduct} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                    Add Product
                </button>
            </div>
        </div>
    );
}
