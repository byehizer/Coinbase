import { useState, useRef, useEffect } from "react";
import { AiOutlineSearch, AiOutlineShopping, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { SearchBar } from "./components/Searchbar";
import { useShoppingCart } from "../../context/shoppingcartcontext";
import { ShoppingCart } from "./components/Shoppingcart";
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';


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
        !buttonRef.current.contains(event.target) // Evita cerrar si se hizo clic en el botón
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
    <header className={`sm:relative  bg-gray-900 ${showCart ? "fixed top-0 w-full z-50" : ""}`}>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="md:flex items-center md:gap-12 flex-shrink-0">
            <Link to="/" className="block text-teal-600 dark:text-teal-600">
              <span className="sr-only">Home</span>
              <svg
                className="h-8"
                viewBox="0 0 28 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>

          <div className="flex items-center lg:gap-10  justify-center md:flex-grow gap-2">
            <SearchBar></SearchBar>
            <div className="md:absolute right-0">
              <button ref={buttonRef}
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
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-500 dark:text-white">
                {menuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
              </button>
            </div>
            <div className="hidden md:block">
              <nav aria-label="Global">
                <ul className="flex items-center lg:gap-10  gap-6 text-sm">
                  <li>
                    <Link to="/" className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"> Home </Link>
                  </li>

                  <li>
                    <Link to="/about" className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"> About Us </Link>
                  </li>
                  
                  <li>
                    <Link to="/contact" className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"> Contact Us </Link>
                  </li>
                  <li>
                    <Link to="/track-order" className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"> Track Order </Link>
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
              <a className="text-white hover:text-gray-300" href="#">About</a>
              <a className="text-white hover:text-gray-300" href="#">Careers</a>
              <a className="text-white hover:text-gray-300" href="#">History</a>
              <a className="text-white hover:text-gray-300" href="#">Contact</a>
            </nav>
          </div>
        )}
      </div>

    </header>
  );
}
