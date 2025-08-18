import { useShoppingCart } from "../context/shoppingcartcontext";
import { AiOutlineDelete } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

export function ShoppingCartPage() {
    const { products, removeProductCompletely, totalAmount, clearShoppingCart } = useShoppingCart();

    const navigate = useNavigate();

    if (products.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)] bg-gray-100 px-4">
                <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg text-center w-full max-w-md">
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Tu carrito está vacío</h2>
                    <Link to="/" className="text-blue-600 hover:text-blue-800 text-lg">
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center p-4 sm:p-6 bg-gray-100 min-h-[calc(100vh-200px)]">
            <div className="w-full sm:w-11/12 md:w-4/5 lg:w-3/5 bg-white p-4 sm:p-8 rounded-lg border shadow-xl flex flex-col justify-between min-h-[75vh]">
                <div className="flex flex-col gap-6 flex-grow">
                    <h1 className="text-2xl sm:text-4xl font-bold text-center">Carrito de Compras</h1>

                    <div className="grid gap-y-6">
                        {products.map((product) => (
                            <div key={product.id} className="flex flex-col sm:flex-row justify-between items-center border-b py-4 gap-4">
                                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-center sm:text-left">
                                    <img
                                        src={`${product.image_url}`}
                                        alt={product.name}
                                        className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-lg"
                                    />
                                    <div>
                                        <h5 className="text-lg sm:text-xl font-medium">{product.name}</h5>
                                        <span className="text-gray-500">Cantidad: {product.quantity}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 sm:gap-8">
                                    <span className="text-lg sm:text-xl font-medium">
                                        ${(product.price * product.quantity).toFixed(2)}
                                    </span>
                                    <button
                                        className="bg-red-600 hover:bg-red-800 text-white rounded-full p-3"
                                        onClick={() => removeProductCompletely(product.id)}
                                    >
                                        <AiOutlineDelete size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total justo antes de los botones */}
                <div className="flex justify-between pt-6 border-t mt-6">
                    <span className="font-medium text-xl sm:text-2xl">Total:</span>
                    <span className="font-medium text-xl sm:text-2xl">${totalAmount.toFixed(2)}</span>
                </div>

                {/* Botones */}
                <div className="grid gap-4 mt-6">
                    <button
                        className="w-full bg-gray-900 text-white px-6 py-4 rounded-lg hover:bg-gray-800 text-lg sm:text-xl"
                        onClick={clearShoppingCart}
                    >
                        Vaciar carrito
                    </button>
                    <button
                        className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-500 text-lg sm:text-xl"
                        onClick={() => navigate(`/orderform`)}
                    >
                        Ir a pagar
                    </button>
                </div>

                {/* Total pegado abajo */}
                <div className="flex justify-between pt-6 border-t mt-6">
                    <span className="font-medium text-xl sm:text-2xl">Total:</span>
                    <span className="font-medium text-xl sm:text-2xl">${totalAmount.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
