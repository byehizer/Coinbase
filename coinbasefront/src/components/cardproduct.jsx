import { useShoppingCart } from "../context/shoppingcartcontext";
import { useNavigate } from "react-router-dom";

export function CardProduct({ product }) {
    const { products, addProduct, updateProductQuantity, removeProduct } = useShoppingCart();
    const navigate = useNavigate();

    const cartProduct = products.find((p) => p.id === product.id);

    return (
        <div className="overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product.id}`, { state: { product } })}>
            <div
                className="rounded-lg border bg-gray-400/10 flex flex-col h-full transform transition-transform duration-300 hover:scale-105"
                style={{ transformOrigin: "center" }}
            >
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-contain bg-white mx-auto"
                />
                <div className="flex flex-col flex-grow gap-y-4 px-4 py-6">
                    <h1 className="font-medium">{product.name}</h1>
                    <p className="text-sm line-clamp-3">{product.description}</p>
                    <span className="font-medium">$ {product.price}</span>

                    {cartProduct ? (
                        <div className="flex items-center justify-center gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
                            <button
                                className="bg-red-600 hover:bg-red-800 text-white font-medium border rounded-lg px-3 py-2"
                                onClick={() => {
                                    cartProduct.quantity > 1
                                        ? updateProductQuantity(product.id, cartProduct.quantity - 1)
                                        : removeProduct(product.id);
                                }}
                            >
                                -
                            </button>
                            <span className="font-medium">{cartProduct.quantity}</span>
                            <button
                                className="bg-green-600 hover:bg-green-800 text-white font-medium border rounded-lg px-3 py-2"
                                onClick={() => updateProductQuantity(product.id, cartProduct.quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <button
                            className="bg-indigo-600 hover:bg-indigo-800 text-slate-200 mt-auto font-medium border rounded-lg px-4 py-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                addProduct({ ...product });
                            }}
                        >
                            Agregar al carrito
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
