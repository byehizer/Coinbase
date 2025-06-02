import { useShoppingCart } from "../context/shoppingcartcontext";
import { useNavigate } from "react-router-dom";

export function CardProduct({ product }) {
  const {
    products,
    addProduct,
    updateProductQuantity,
    removeProductCompletely,
  } = useShoppingCart();
  const navigate = useNavigate();

  const cartProduct = products.find((p) => p.id === product.id);
  const isOutOfStock = product.stock === 0;

  return (
    <div
      className="cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
    >
      <div
        className="rounded-lg border bg-gray-400/10 flex flex-col h-full transform transition-transform duration-300 hover:scale-105"
        style={{ transformOrigin: "center" }}
      >
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-contain bg-white mx-auto"
        />
        <div className="flex flex-col flex-grow gap-y-4 px-4 py-6">
          <h1 className="font-medium">{product.name}</h1>
          <p className="text-sm line-clamp-3">{product.description}</p>
          <span className="text-sm text-gray-500">
            País de origen: {product.country_origin}
          </span>
          <span className="text-sm text-gray-500">Year: {product.year}</span>
          <span className="font-medium">$ {product.price}</span>

          {isOutOfStock ? (
            <div className="flex flex-col items-center mt-auto">
              <p className="text-red-600 font-semibold mb-2">Sin stock</p>
              <button
                disabled
                className="bg-gray-400 text-white font-medium border rounded-lg px-4 py-2 cursor-not-allowed opacity-60"
                onClick={(e) => e.stopPropagation()}
              >
                Agregar al carrito
              </button>
            </div>
          ) : cartProduct ? (
            <div
              className="flex items-center justify-center gap-2 mt-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="bg-red-600 hover:bg-red-800 text-white font-medium border rounded-lg px-3 py-2"
                onClick={() => {
                  cartProduct.quantity > 1
                    ? updateProductQuantity(
                        product.id,
                        cartProduct.quantity - 1
                      )
                    : removeProductCompletely(product.id);
                }}
              >
                -
              </button>
              <span className="font-medium">{cartProduct.quantity}</span>
              <button
                className="bg-green-600 hover:bg-green-800 text-white font-medium border rounded-lg px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={cartProduct.quantity >= product.stock}
                onClick={() =>
                  updateProductQuantity(product.id, cartProduct.quantity + 1)
                }
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
