import { useShoppingCart } from "../context/shoppingcartcontext";
import { AiOutlineDelete } from "react-icons/ai"; // Icono de eliminar
import { Link } from "react-router-dom"; // Para la navegación (si es necesario)

export function ShoppingCartPage() {
    const { products, removeProduct, totalAmount, clearShoppingCart, removeProductCompletely } = useShoppingCart();

    if (products.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <h2 className="text-3xl font-semibold mb-4">Tu carrito está vacío</h2>
                    <Link to="/" className="text-blue-600 hover:text-blue-800 text-lg">
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        );
    }
    return (
        <div className="flex justify-center p-6">
            <div className="w-3/5 bg-white p-8 rounded-lg border shadow-xl">
                <h1 className="text-4xl font-bold mb-6 text-center">Carrito de Compras</h1>

                <div className="grid gap-y-6">
                    {/* Mostrar los productos del carrito */}
                    {products.map((product) => (
                        <div key={product.id} className="flex justify-between items-center border-b py-4">
                            <div className="flex items-center gap-x-8">
                                <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-lg" />
                                <div>
                                    <h5 className="text-xl font-medium">{product.name}</h5>
                                    <span className="text-lg text-gray-500">Cantidad: {product.quantity}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-x-8">
                                <span className="text-xl font-medium">${(product.price * product.quantity).toFixed(2)}</span>
                                <button
                                    className="bg-red-600 hover:bg-red-800 text-white rounded-full p-4"
                                    onClick={() => removeProductCompletely(product.id)} // Llamada a la función para eliminar el producto completamente
                                >
                                    <AiOutlineDelete size={24} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Total del carrito */}
                <div className="flex justify-between pt-6 border-t">
                    <span className="font-medium text-2xl">Total:</span>
                    <span className="font-medium text-2xl">${totalAmount.toFixed(2)}</span>
                </div>

                {/* Botón para vaciar el carrito */}
                <button
                    className="w-full bg-gray-900 text-white px-6 py-4 mt-6 rounded-lg hover:bg-gray-800 text-xl"
                    onClick={clearShoppingCart}
                >
                    Vaciar carrito
                </button>
                <button
                    className="w-full bg-gray-900 text-white px-6 py-4 mt-6 rounded-lg hover:bg-gray-800 text-xl"
                    onClick={clearShoppingCart}
                >
                    Ir a pagar
                </button>
            </div>
        </div>
    );
}
