import { useShoppingCart } from "../../../context/shoppingcartcontext";
import { AiOutlineDelete } from "react-icons/ai"
import EmptyShoppingCart from "./EmptyShoppingcart";


export function ShoppingCart() {
    const { products, removeProduct, totalAmount, clearShoppingCart, updateProductQuantity, removeProductCompletely } =
        useShoppingCart();

    if (products.length === 0) return <EmptyShoppingCart />;

    return (
        <div className="bg-white p-4 rounded-lg border shadow-lg">
            <div className="grid gap-y-3 py-3">
                {products.map((product) => (
                    <div key={product.id} className="flex gap-x-4 items-center">
                        <img src={product.image} alt={product.name} className="w-12" />
                        <h5 className="w-32 text-ellipsis truncate font-medium">
                            {product.name}
                        </h5>
                        <div className="flex items-center gap-x-4">
                            {/* Botón para reducir cantidad */}
                            <button
                                className="bg-red-600 hover:bg-red-800 text-white font-medium border rounded-lg px-3 py-2"
                                onClick={() => {
                                    product.quantity > 1
                                        ? updateProductQuantity(product.id, product.quantity - 1)  // Disminuir la cantidad
                                        : removeProductCompletely(product.id);  // Eliminar el producto si la cantidad es 1
                                }}
                            >
                                -
                            </button>

                            {/* Mostrar cantidad */}
                            <span className="font-medium">{product.quantity}</span>

                            {/* Botón para aumentar cantidad */}
                            <button
                                className="bg-green-600 hover:bg-green-800 text-white font-medium border rounded-lg px-3 py-2"
                                onClick={() => updateProductQuantity(product.id, product.quantity + 1)}  // Aumentar la cantidad
                            >
                                +
                            </button>
                        </div>
                        <span className="ml-auto">$ {(product.price * product.quantity).toFixed(2)}</span>
                        <div>
                            <button
                                className="bg-red-600 hover:bg-red-800 text-white hover:text-slate-200 rounded-full p-2"
                                onClick={() => removeProductCompletely(product.id)}
                            >
                                <AiOutlineDelete />
                            </button>

                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between pt-2 border-t">
                <span className="font-medium text-xl">Total:</span>
                <span className="font-medium text-xl">$ {totalAmount}</span>
            </div>
            <button
                className="w-full bg-gray-900 text-white px-4 py-2 mt-2 rounded-lg hover:bg-gray-800"
                onClick={clearShoppingCart}
            >
                Vaciar carrito
            </button>
        </div>
    );
}