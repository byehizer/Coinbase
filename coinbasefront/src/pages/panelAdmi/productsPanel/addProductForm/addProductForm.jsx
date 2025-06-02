import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../../context/AuthContext";

export function AddProductForm() {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    year: "",
    country_origin: "",
    price: "",
    stock: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const { token } = useAuth();

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

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("Product added successfully!");
        navigate("/admin/products");
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || "Could not add product"}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("An error occurred while adding the product.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white sm:bg-gray-100">
      <div className="w-full max-w-lg sm:max-w-2xl bg-white p-8 shadow-md rounded-md relative">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
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
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleChange}
              className="mt-2 p-2 w-full border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Year
            </label>
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
            <label className="block text-sm font-medium text-gray-700">
              Country of Origin
            </label>
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
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
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
            <label className="block text-sm font-medium text-gray-700">
              Stock
            </label>
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
            <label htmlFor="productImage" className="block text-lg mb-2">
              Upload Product Image
            </label>
            <input
              type="file"
              id="productImage"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {imageFile && (
            <div className="mt-8 relative">
              <h3 className="text-lg font-semibold mb-4">Vista previa</h3>
              <div className="flex justify-center mt-6 relative">
                <div
                  className="w-64 rounded-lg border bg-gray-400/10 shadow-xl flex flex-col transform transition-transform duration-300 hover:scale-105 z-[50] relative"
                  style={{ transformOrigin: "center" }}
                >
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt={productData.name}
                    className="w-full h-48 object-contain bg-white mx-auto"
                  />
                  <div className="flex flex-col flex-grow gap-y-4 px-4 py-6">
                    <h1 className="font-medium text-lg">{productData.name}</h1>
                    <p className="text-sm line-clamp-3">
                      {productData.description}
                    </p>
                    <span className="text-sm text-gray-500">
                      País de origen: {productData.country_origin}
                    </span>
                    <span className="text-sm text-gray-500">
                      Año: {productData.year}
                    </span>
                    <span className="font-medium">
                      $ {productData.price}
                    </span>
                    <button
                      type="button"
                      className="bg-indigo-600 text-slate-200 mt-auto font-medium border rounded-lg px-4 py-2 cursor-default"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Vista previa
                    </button>
                  </div>
                </div>
              </div>
            </div>
           
          )}

          <div className="flex justify-between mt-8">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              Save Product
            </button>
            <button
              type="button"
              onClick={handleGoBack}
              className="bg-red-600 text-white px-6 py-2 rounded"
            >
              Go Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
