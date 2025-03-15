import { createContext, useCallback, useMemo, useState, useContext } from "react";

export const ShoppingCartContext = createContext({
    products: [],
    totalAmount: 0,
    addProduct: () => { },
    removeProduct: () => { },
    clearShoppingCart: () => { },
});

export const ShoppingCartProvider = ({ children }) => {
    const [products, setProducts] = useState([]);

    const totalAmount = useMemo(() => {
        return products.reduce((total, product) => total + product.price * product.quantity, 0);
    }, [products]);

    const addProduct = useCallback((product) => {
        setProducts((prevProducts) => {
            const existingProduct = prevProducts.find((p) => p.id === product.id);
            if (existingProduct) {
                return prevProducts.map((p) =>
                    p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
                );
            }
            return [...prevProducts, { ...product, quantity: 1 }];
        });
    }, []);

    const removeProduct = useCallback((productId) => {
        setProducts((prevProducts) => {
            return prevProducts
                .map((p) => (p.id === productId ? { ...p, quantity: p.quantity - 1 } : p))
                .filter((p) => p.quantity > 0);
        });
    }, []);

    const clearShoppingCart = useCallback(() => setProducts([]), []);

    return (
        <ShoppingCartContext.Provider
            value={{ products, totalAmount, addProduct, removeProduct, clearShoppingCart }}
        >
            {children}
        </ShoppingCartContext.Provider>
    );
};

export const useShoppingCart = () => useContext(ShoppingCartContext);