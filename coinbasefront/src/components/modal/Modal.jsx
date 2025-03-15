import ReactDOM from "react-dom";

export function Modal({ children }) {
    return ReactDOM.createPortal(
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                {children}
            </div>
        </div>,
        document.getElementById("modal")
    );
}
