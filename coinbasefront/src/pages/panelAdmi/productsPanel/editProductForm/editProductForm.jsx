import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useModal } from "../../../../context/ModalContext";
import { toast } from "react-toastify";


export function EditProductForm() {
    const { openModal } = useModal();
    const navigate = useNavigate();
    const location = useLocation();
    const product = location.state?.product || {}

    const [productData, setProductData] = useState({
        name: "",
        description: "",
        year: "",
        country_origin: "",
        price: "",
        stock: "",
        image_url: "",
    });

    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (product) {
            setProductData({
                name: product.name || "",
                description: product.description || "",
                year: product.year ? parseInt(product.year, 10) : "", 
                country_origin: product.country_origin || "",
                price: product.price ? parseFloat(product.price) : "", 
                stock: product.stock ? parseInt(product.stock, 10) : "", 
                image_url: product.image_url || "",
            });
        }
    }, [product]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!productData.name || !productData.year || !productData.price || !productData.stock || !productData.country_origin) {
            toast.error("Only description and image can be empty.");
            return;
        }

        const formData = new FormData();
        formData.append("name", productData.name);
        formData.append("description", productData.description);
        formData.append("year", productData.year);
        formData.append("country_origin", productData.country_origin);
        formData.append("price", productData.price);
        formData.append("stock", productData.stock);

        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const response = await fetch(`http://localhost:5000/api/products/${product.id}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            toast.success("Product updated successfully");
            navigate("/admin/products");
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("An error occurred while updating the product");
        }
    };


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
                <form onSubmit={handleSubmit}>
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
                        <label htmlFor="productImage" className="block text-sm font-medium text-gray-700">Upload New Image</label>
                        <input
                            type="file"
                            id="productImage"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className="mt-2 p-2 w-full border border-gray-300 rounded"
                        />
                    </div>
                    {productData.image_url && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600">Current image:</p>
                            <img
                                src={`http://localhost:5000${productData.image_url}`}
                                alt="Current product"
                                className="mt-2 w-40 h-auto border rounded shadow-sm"
                            />
                        </div>
                    )}
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
