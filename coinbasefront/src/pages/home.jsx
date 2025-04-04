import { CardProduct } from "../components/cardproduct";
import { useLocation } from "react-router-dom";
import dataProducts from "../data.json";

export function Home() {
    const location = useLocation();

    
    const queryParams = new URLSearchParams(location.search);
    const searchValue = queryParams.get("q")?.toLowerCase() || "";

    
    const filteredProducts = searchValue.length > 0
        ? dataProducts.filter(product =>
            product.name.toLowerCase().includes(searchValue)
        )
        : dataProducts;

    return (
        <div className="w-full max-w-6xl px-4 mx-auto mt-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
            {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                    <CardProduct key={product.id} product={product} />
                ))
            ) : (
                <p className="col-span-full text-center text-gray-500 text-xl">No se encontraron productos.</p>
            )}
        </div>
    );
}
