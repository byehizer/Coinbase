import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function editProductForm() {
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        year: "",
        country_origin: "",
        price: "",
        stock: "",
        image_url: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value,
        });
    };

    const handleGoBack = () => {
        navigate("/admin/products");
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-white sm:bg-gray-100">
 
            <div className="w-full max-w-lg sm:max-w-2xl bg-white p-8 shadow-md rounded-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={productData.name}
                            onChange={handleChange}
                            className="mt-2 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={productData.description}
                            onChange={handleChange}
                            className="mt-2 p-2 w-full border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Year</label>
                        <input
                            type="number"
                            name="year"
                            value={productData.year}
                            onChange={handleChange}
                            className="mt-2 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Country of Origin</label>
                        <input
                            type="text"
                            name="country_origin"
                            value={productData.country_origin}
                            onChange={handleChange}
                            className="mt-2 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={productData.price}
                            onChange={handleChange}
                            className="mt-2 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={productData.stock}
                            onChange={handleChange}
                            className="mt-2 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="productImage" className="block text-lg mb-2">Upload Product Image</label>
                        <input
                            type="file"
                            id="productImage"
                            accept="image/*"
                            className="block w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
                            Save Product
                        </button>
                        <button type="button" onClick={handleGoBack} className="bg-red-600 text-white px-6 py-2 rounded">
                            Go Back
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
