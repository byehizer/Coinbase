import { createContext, useContext, useState } from "react";
import { Modal } from "../components/modal/Modal";

const ModalContext = createContext();

export function ModalProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState({
        title: "",
        text: "",
    });
    const [resolveCallback, setResolveCallback] = useState(null);

    const openModal = ({ title, text }) => {
        setContent({ title, text });
        setIsOpen(true);

        return new Promise((resolve) => {
            setResolveCallback(() => resolve);
        });
    };

    const closeModal = (isConfirm) => {
        setIsOpen(false);
        setContent({ title: "", text: "" });

        if (resolveCallback) {
            resolveCallback(isConfirm);
        }
    };

    return (
        <ModalContext.Provider
            value={{
                isOpen,
                openModal,
                closeModal,
            }}
        >
            {children}

            {isOpen && (
                <Modal>
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-lg">
                        <h2 className="text-center text-xl font-semibold mb-4">{content.title}</h2>
                        <p className="text-center text-gray-600 text-lg mb-6">{content.text}</p>

                        <div className="flex justify-center gap-4">
                            <button
                                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 focus:outline-none"
                                onClick={() => closeModal(true)}
                            >
                                Confirmar
                            </button>
                            <button
                                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
                                onClick={() => closeModal(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </ModalContext.Provider>
    );
}

export const useModal = () => useContext(ModalContext);
