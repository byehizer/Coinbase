import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/ModalContext";
import { SidebarAdmin } from "../../../components/sidebaradmin";
import { toast } from "react-toastify";

// Importamos el hook util que hiciste
import { useGuardToken } from "../../../utils/useGuardToken";

export function ProductsPanel() {
  const { openModal } = useModal();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Usamos el hook util para proteger el token
  const guard = useGuardToken();

  useEffect(() => {
    if (guard()) return; // Si expiró, corta ejecución

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
  }, []); // Solo al montar

  const handleGoEdit = (product) => {
    if (guard()) return; // Validación token
    navigate(`/admin/products/edit`, { state: { product } });
  };

  const deleteProduct = async (id) => {
    if (guard()) return; // Validación token
    const confirm = await openModal({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this product?",
    });

    if (confirm) {
      try {
        await fetch(`http://localhost:5000/api/products/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // O tu fuente de token
          },
        });
        setProducts((prev) => prev.filter((product) => product.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const redirectToAddProduct = () => {
    if (guard()) return; // Validación token
    navigate("/admin/products/add");
  };

  return (
    <div className="flex bg-gray-100 min-h-[90vh]">
      <SidebarAdmin />

      <div className="flex-1 p-6 mb-11">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Product Management
        </h1>

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
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="py-2 px-4 border">{product.id}</td>
                  <td className="py-2 px-4 border">{product.name}</td>
                  <td className="py-2 px-4 border">{product.description}</td>
                  <td className="py-2 px-4 border">{product.year}</td>
                  <td className="py-2 px-4 border">{product.country_origin}</td>
                  <td className="py-2 px-4 border">${product.price}</td>
                  <td className="py-2 px-4 border">{product.stock}</td>
                  <td className="py-2 px-4 border flex justify-center items-center space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => handleGoEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4 mt-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow">
              <p>
                <strong>Name:</strong> {product.name}
              </p>
              <p>
                <strong>Description:</strong> {product.description}
              </p>
              <p>
                <strong>Year:</strong> {product.year}
              </p>
              <p>
                <strong>Country:</strong> {product.country_origin}
              </p>
              <p>
                <strong>Price:</strong> ${product.price}
              </p>
              <p>
                <strong>Stock:</strong> {product.stock}
              </p>
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => handleGoEdit(product)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deleteProduct(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={redirectToAddProduct}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
        <button
          onClick={() => {
            logout();
            navigate("/admin");
            toast.success("Sesión cerrada exitosamente");
          }}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded ml-4"
        >
          Close Session
        </button>
      </div>
    </div>
  );
}


  return (
    <div className="flex bg-gray-100 min-h-[90vh]">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Contenido Principal */}
      <div className="flex-1 p-6 mb-11">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Product Management
        </h1>

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
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="py-2 px-4 border">{product.id}</td>
                  <td className="py-2 px-4 border">{product.name}</td>
                  <td className="py-2 px-4 border">{product.description}</td>
                  <td className="py-2 px-4 border">{product.year}</td>
                  <td className="py-2 px-4 border">{product.country_origin}</td>
                  <td className="py-2 px-4 border">${product.price}</td>
                  <td className="py-2 px-4 border">{product.stock}</td>
                  <td className="py-2 px-4 border flex justify-center items-center space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => handleGoEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tarjetas para mobile */}
        <div className="md:hidden space-y-4 mt-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow">
              <p>
                <strong>Name:</strong> {product.name}
              </p>
              <p>
                <strong>Description:</strong> {product.description}
              </p>
              <p>
                <strong>Year:</strong> {product.year}
              </p>
              <p>
                <strong>Country:</strong> {product.country_origin}
              </p>
              <p>
                <strong>Price:</strong> ${product.price}
              </p>
              <p>
                <strong>Stock:</strong> {product.stock}
              </p>
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => handleGoEdit(product)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deleteProduct(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={redirectToAddProduct}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
        <button
          onClick={() => {
            logout();
            navigate("/admin");
            toast.success("Sesión cerrada exitosamente");
          }}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded ml-4"
        >
          Close Session
        </button>
      </div>
    </div>
  );
}
