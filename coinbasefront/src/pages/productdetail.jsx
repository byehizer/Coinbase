import { useLocation, useParams } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai"
import { useState } from "react";
import { useShoppingCart } from "../context/shoppingcartcontext";

export function ProductDetail() {
    const location = useLocation();
    const { id } = useParams();
    const product = location.state?.product;
    const [modal, setModal] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { products, addProduct, updateProductQuantity, removeProduct } = useShoppingCart();

    const increaseQuantity = () => {
        setQuantity((prev) => prev + 1);
    };

    const decreaseQuantity = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const toggleModal = () => {
        setModal((prev) => !prev);
    };
    const handleAddToCart = () => {
        const existingProduct = products.find(p => p.id === product.id);

        if (existingProduct) {
            updateProductQuantity(product.id, existingProduct.quantity + quantity);
        } else {
            addProduct({ ...product });
            updateProductQuantity(product.id, quantity)
        }
        setQuantity(1)
    };

    if (!product) {
        return <p>Producto no encontrado.</p>;
    }

    return (
        <div className="main-wrapper flex flex-col md:flex-row md:px-[200px] md:py-[100px] relative">
            <div className="image md:basis-1/2 md:flex md:flex-col md:justify-between">
                <div className="hidden md:block large-image xl:pl-32">
                    <img
                        className="cursor-pointer rounded-xl w-[400px] h-[400px] object-contain shadow-2xl "
                        src={product.image}
                        alt={product.name}
                        onClick={toggleModal}
                    />
                </div>
                <div className="md:hidden large-image shadow-2xl">
                    <img
                        className="w-[100%] h-[300px] object-contain "
                        src={product.image}
                        alt={product.name}
                    />
                </div>
            </div>
            <div
                className={`${modal ? "hidden" : "hidden md:block"
                    } absolute -top-[20%] right-0 -bottom-[20%] left-0 bg-lightBlack z-50`}
            >
                <div
                    className={
                        "basis-1/2 flex flex-col justify-between absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]"
                    }
                >
                    <div className="large-image">
                        <img
                            className="w-[400px] h-[400px] rounded-xl cursor-pointer"
                            src={product.image}
                            alt={product.name}
                        />
                        <AiOutlineClose color="white" className="w-[20px] h-[20px] absolute -top-8 left-[95%] transition-all cursor-pointer hover:scale-150"
                            onClick={toggleModal} />
                    </div>

                </div>
            </div>
            <div className="description p-6 md:basis-1/2 md:py-[40px]">
                <h1 className="text-3xl md:text-4xl capitalize font-[700]">
                    {product.name}
                </h1>
                <p className="hidden md:block text-darkGrayishBlue my-10 leading-7">
                    {product.description}
                </p>
                <p className="md:hidden text-darkGrayishBlue my-6 leading-7">
                    {product.description}
                </p>
                <div className="price flex items-center">
                    <span className="text-3xl font-[700] mr-4">{product.price}</span>

                </div>
                <div className="buttons-container flex flex-col md:flex-row mt-8">
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
                        className="add-btn border-none bg-orange rounded-lg text-white font-[700] px-[70px] py-[18px] mt-4   md:text-[14px] transition-all btn-shadow hover:opacity-50">
                        Add to cart
                    </button>
                </div>
            </div>

        </div>
    );
}
