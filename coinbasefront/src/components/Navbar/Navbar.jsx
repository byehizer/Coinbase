import { useState, useRef, useEffect } from "react";
import {
  AiOutlineSearch,
  AiOutlineShopping,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";
import { SearchBar } from "./components/Searchbar";
import { useShoppingCart } from "../../context/shoppingcartcontext";
import { ShoppingCart } from "./components/Shoppingcart";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

export function Navbar() {
  const [showCart, setShowCart] = useState(false);
  const { products } = useShoppingCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setShowCart(false);
  }, [location.pathname]);

  const cartRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cartRef.current &&
        !cartRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowCart(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowCart(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header
      className={`sm:relative  bg-gray-900 ${
        showCart ? "fixed top-0 w-full z-50" : ""
      }`}
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="md:flex items-center md:gap-12 flex-shrink-0">
            <Link to="/" className="block text-teal-600 dark:text-teal-600">
              <span className="sr-only">Home</span>
              <img src="/coin-logo.svg" alt="Logo" className=" ml-2 w-14 h-14" />
            </Link>
          </div>

          <div className="flex items-center lg:gap-10  justify-center md:flex-grow gap-2">
            <SearchBar></SearchBar>
            <div className="md:absolute right-0">
              <button
                ref={buttonRef}
                className="hover:bg-slate-200/20 rounded-full p-2 text-white flex items-center gap-1"
                onClick={() => setShowCart(!showCart)}
              >
                <AiOutlineShopping className="text-2xl" />
                <div className="bg-white p-1 text-xs text-gray-900 w-6 h-6 rounded-[50%]">
                  <span>{products.length}</span>
                </div>
              </button>
            </div>
            {showCart && (
              <div
                ref={cartRef}
                className="sm:absolute sm:top-12 sm:right-0 sm:w-max fixed top-[64px] sm:left-auto left-0 w-full h-[calc(100vh-64px)] sm:h-auto z-50"
              >
                <ShoppingCart></ShoppingCart>
              </div>
            )}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 text-gray-500 dark:text-white"
              >
                {menuOpen ? (
                  <AiOutlineClose size={24} />
                ) : (
                  <AiOutlineMenu size={24} />
                )}
              </button>
            </div>
            <div className="hidden md:block">
              <nav aria-label="Global">
                <ul className="flex items-center lg:gap-10  gap-6 text-sm">
                  <li>
                    <Link
                      to="/"
                      className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                    >
                      {" "}
                      Home{" "}
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/about"
                      className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                    >
                      {" "}
                      About Us{" "}
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/contact"
                      className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                    >
                      {" "}
                      Contact Us{" "}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/track-order"
                      className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                    >
                      {" "}
                      Track Order{" "}
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
        {menuOpen && (
          <div className="fixed inset-0 bg-gray-900  bg-opacity-90 flex flex-col items-center justify-center z-50">
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-5 right-5 text-white text-3xl"
            >
              <AiOutlineClose />
            </button>
            <nav className="flex flex-col items-center gap-6 text-2xl">
              <Link to="/" className="text-white hover:text-gray-300">
                {" "}
                Home{" "}
              </Link>
              <Link to="/about" className="text-white hover:text-gray-300">
                {" "}
                About Us{" "}
              </Link>
              <Link to="/contact" className="text-white hover:text-gray-300">
                {" "}
                Contact Us{" "}
              </Link>
              <Link
                to="/track-order"
                className="text-white hover:text-gray-300"
              >
                {" "}
                Track Order{" "}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
