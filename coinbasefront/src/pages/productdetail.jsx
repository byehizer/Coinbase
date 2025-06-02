import { useLocation, useParams } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
import { useShoppingCart } from "../context/shoppingcartcontext";

export function ProductDetail() {
  const location = useLocation();
  const { id } = useParams();
  const product = location.state?.product;
  const [modal, setModal] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { products, addProduct, updateProductQuantity, removeProduct } =
    useShoppingCart();

  const increaseQuantity = () => {
    if (product.stock !== undefined && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  const handleAddToCart = () => {
    const existingProduct = products.find((p) => p.id === product.id);

    if (existingProduct) {
      updateProductQuantity(product.id, existingProduct.quantity + quantity);
      product.stock = product.stock - quantity;
    } else {
      addProduct({ ...product });
      updateProductQuantity(product.id, quantity);
      product.stock = product.stock - quantity;
    }
    setQuantity(1);
  };

  if (!product) {
    return <p>Producto no encontrado.</p>;
  }

  const formattedPrice = `$${product.price.toFixed(2)}`;

  return (
    <div className="flex justify-center min-h-[calc(100vh-200px)] items-center">
      <div className="main-wrapper flex flex-col md:flex-row md:px-[200px] md:py-[100px] relative items-start ">
        {/* Imagen */}
        <div className="image md:basis-1/2 md:flex md:flex-col md:justify-between items-center text-center">
          <div className="hidden md:flex large-image justify-center ">
            <img
              className="cursor-pointer rounded-xl 
               md:w-[400px] md:h-[400px] 
               lg:w-[500px] lg:h-[500px] 
               object-contain shadow-2xl"
              src={product.image_url}
              alt={product.name}
              onClick={toggleModal}
            />
          </div>
          <div className="md:hidden w-screen px-4 flex justify-center shadow-2xl">
            <img
              className="w-full max-w-[600px] h-[300px] object-contain"
              src={product.image_url}
              alt={product.name}
            />
          </div>
        </div>

        {/* Modal Imagen Ampliada */}
        <div
          className={`${modal ? "hidden" : "hidden md:block"} 
        fixed top-0 left-0 w-full h-full bg-lightBlack z-50 flex items-center justify-center`}
        >
          <div className="relative flex flex-col items-center justify-center min-h-full">
            <div className="relative">
              <img
                className="w-[400px] h-[400px] rounded-xl cursor-pointer"
                src={product.image_url}
                alt={product.name}
              />
              <AiOutlineClose
                color="white"
                className="w-[20px] h-[20px] absolute -top-8 right-0 transition-all cursor-pointer hover:scale-150"
                onClick={toggleModal}
              />
            </div>
          </div>
        </div>

        {/* Descripción y detalles */}
        <div className="description p-6 md:basis-1/2 md:py-[40px]">
          <h1 className="text-3xl md:text-4xl capitalize font-[700]">
            {product.name}
          </h1>

          <div className="product-info mt-2  lg:mt-10 xl:mt-10 mb-6 text-sm text-gray-500 flex space-x-4">
            {product.year && <span>Year: {product.year}</span>}
            {product.country_origin && (
              <span>Country: {product.country_origin}</span>
            )}
          </div>

          <p className="text-darkGrayishBlue my-6 leading-7">
            {product.description}
          </p>

          <div className="price flex items-center mb-4">
            <span className="text-3xl font-[700] mr-4">{formattedPrice}</span>
          </div>

          {/* Control de cantidad y botón */}
          {product.stock === 0 ? (
            <>
              <p className="flex justify-center items-center w-full h-[180px] bg-red-100 text-red-700 text-2xl md:text-3xl font-bold rounded-lg mt-8">
                Producto agotado
              </p>
              <div className="hidden md:block h-[70px]" />
              {/* simula espacio del botón */}
            </>
          ) : (
            <>
              {/* Control de cantidad y botón */}
              <div className="buttons-container flex flex-col md:flex-row xl:mt-40 lg:mt-14">
                <div className="state w-[100%] flex justify-around md:justify-center items-center space-x-10 bg-lightGrayishBlue rounded-lg p-3 md:p-2 md:mr-4 md:w-[150px]">
                  <button
                    onClick={decreaseQuantity}
                    className="minus text-[24px] md:text-[2rem] font-[700] text-orange transition-all hover:opacity-50"
                  >
                    -
                  </button>
                  <p className="md:text-[1.5rem] font-bold">{quantity}</p>
                  <button
                    className="plus text-[24px] md:text-[2rem] font-[700] text-orange transition-all hover:opacity-50"
                    onClick={increaseQuantity}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="add-btn border-none bg-orange rounded-lg text-white font-[700] px-[70px] py-[18px] md:text-[14px] transition-all btn-shadow hover:opacity-50"
                >
                  Añadir {quantity} {quantity > 1 ? "productos" : "producto"} al
                  carrito
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
