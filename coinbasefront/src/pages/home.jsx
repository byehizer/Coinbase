import { CardProduct } from "../components/cardproduct";
import { useShoppingCart } from "../context/shoppingcartcontext";
import dataProducts from "../data.json";

export function Home() {
    return (
        <div className="w-full max-w-6xl px-4 mx-auto mt-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
            {dataProducts.map((product) => (
                <CardProduct key={product.id} product={product} />
            ))}
        </div>
    );
}