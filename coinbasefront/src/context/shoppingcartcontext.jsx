import { createContext, useCallback, useMemo, useState, useContext } from "react";

export const ShoppingCartContext = createContext({
    products: [],
    totalAmount: 0,
    addProduct: () => { },
    clearShoppingCart: () => { },
    removeProductCompletely: () => { },
});

export const ShoppingCartProvider = ({ children }) => {
    const [products, setProducts] = useState([]);

    const totalAmount = useMemo(() => {
        return products.reduce((total, product) => total + product.price * product.quantity, 0);
    }, [products]);

    const removeProductCompletely = useCallback((productId) => {  // Nueva función
        setProducts((prevProducts) => {
            return prevProducts.filter((product) => product.id !== productId);
        });
    }, []);

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


    const updateProductQuantity = (productId, quantity) => {
        setProducts((prev) =>
            prev.map((product) =>
                product.id === productId ? { ...product, quantity } : product
            )
        );
    };

    const clearShoppingCart = useCallback(() => setProducts([]), []);

    return (
        <ShoppingCartContext.Provider
            value={{ products, totalAmount, addProduct, clearShoppingCart, updateProductQuantity, removeProductCompletely }}
        >
            {children}
        </ShoppingCartContext.Provider>
    );
};

export const useShoppingCart = () => useContext(ShoppingCartContext);