import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useModal } from "../../../../context/ModalContext";
import { toast } from "react-toastify";
import { useAuth } from "../../../../context/AuthContext";
import { useGuardToken } from "../../../../utils/guard";

export default function EditProductForm() {
  const { openModal } = useModal();
  const navigate = useNavigate();
  const location = useLocation();
  const guard= useGuardToken();
  const product = location.state?.product || {};
  const { token } = useAuth();
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    year: "",
    country_origin: "",
    price: "",
    stock: "",
  });
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateFields = () => {
    const year = parseInt(productData.year, 10);
    const price = parseFloat(productData.price);
    const stock = parseInt(productData.stock, 10);
    const currentYear = new Date().getFullYear();

    if (!productData.name.trim()) return "Name is required";
    if (!productData.country_origin.trim())
      return "Country of origin is required";
    if (isNaN(year) || year < 1700 || year > currentYear)
      return "Year must be between 1700 and current year";
    if (isNaN(price) || price <= 0)
      return "Price must be a number greater than 0";
    if (isNaN(stock) || stock < 0) return "Stock cannot be negative";

    return null; // No errors
  };

  useEffect(() => {
    if (guard()){
      return;
    }
    if (product) {
      setProductData({
        name: product.name || "",
        description: product.description || "",
        year: product.year ? parseInt(product.year, 10) : "",
        country_origin: product.country_origin || "",
        price: product.price ? parseFloat(product.price) : "",
        stock: product.stock ? parseInt(product.stock, 10) : "",
      });

      if (product.image_url) {
        setPreviewImage(`${product.image_url}`);
      }
    }
  }, [product]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (guard()) {
      return;
    }
    setLoading(true);

    const error = validateFields();
    if (error) {
      toast.error(error);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    for (const key in productData) {
      formData.append(key, productData[key]);
    }

    if (file) {
      formData.append("image", file);
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${product.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const data = await response.json(); // <- podés acceder al mensaje del backend
        throw new Error(data.message || `Error ${response.status}`);
      }

      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      const message =
        error.message || "An error occurred while updating the product";
      toast.error(message);
    }
    setLoading(false);
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
            {previewImage && (
              <div className="mt-8 relative">
                <h3 className="text-sm font-medium text-gray-700">
                  Preview view
                </h3>
                <div className="flex justify-center mt-6 relative">
                  <div
                    className="w-64 rounded-lg border bg-gray-400/10 shadow-xl flex flex-col transform transition-transform duration-300 hover:scale-105 z-[50] relative"
                    style={{ transformOrigin: "center" }}
                  >
                    <img
                      src={previewImage}
                      alt={productData.name}
                      className="w-full h-48 object-contain bg-white mx-auto"
                    />
                    <div className="flex flex-col flex-grow gap-y-4 px-4 py-6 min-h-[340px]">
                      <h1 className="font-medium text-lg">
                        {productData.name}
                      </h1>
                      <p className="text-sm line-clamp-3">
                        {productData.description}
                      </p>
                      <span className="text-sm text-gray-500">
                        País de origen: {productData.country_origin}
                      </span>
                      <span className="text-sm text-gray-500">
                        Año: {productData.year}
                      </span>
                      <span className="font-medium ">
                        $ {productData.price}
                      </span>
                      <button
                        type="button"
                        className="bg-indigo-600 text-slate-200 mt-auto font-medium border rounded-lg px-4 py-2 cursor-default"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Preview view
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="productImage" className="block text-lg mb-2">
              Upload Product Image
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              id="productImage"
              accept="image/*"
              className="block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex justify-between">
            <button
              disabled={loading}
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              {loading ? "Saving..." : "Save Product"}
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
