import { CardProduct } from "../components/cardproduct";
import { useLocation } from "react-router-dom";
import dataProducts from "../data.json";
import { useState, useEffect } from "react";

export function Home() {
  const location = useLocation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const backendProductsRaw = await response.json();

        const backendProducts = backendProductsRaw.map((product) => ({
          ...product,
          image_url: `http://localhost:5000${product.image_url}`,
          price: Number(product.price),
          year: Number(product.year),
          stock: Number(product.stock),
        }));

        const mergedMap = new Map();

        dataProducts.forEach((p) => mergedMap.set(p.id, p));
        backendProducts.forEach((p) => mergedMap.set(p.id, p));

        setProducts(Array.from(mergedMap.values()));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const queryParams = new URLSearchParams(location.search);
  const searchValue = queryParams.get("q")?.toLowerCase() || "";

  const filteredProducts =
    searchValue.length > 0
      ? products.filter((product) =>
          product.name.toLowerCase().includes(searchValue)
        )
      : products;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a.stock > 0 && b.stock === 0) return -1;
    if (a.stock === 0 && b.stock > 0) return 1;
    return 0;
  });

  return (
     <div className="w-full max-w-6xl px-4 mx-auto mt-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-[2rem]">
      {sortedProducts.length > 0 ? (
        sortedProducts.map((product) => (
          <CardProduct key={product.id} product={product} />
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500 text-xl">
          No se encontraron productos.
        </p>
      )}
    </div>
  );
}
