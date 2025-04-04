import { useState, useEffect, useRef, useMemo } from "react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import dataProducts from "../../../data.json";
import { useNavigate } from "react-router-dom";

export function SearchBar() {
    const [value, setValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (value.length > 0) {
            setIsOpen(true);
        }
    }, [value]);

    const handleSearch = (customValue) => {
        const searchValue = customValue ?? value;

        if (searchValue.trim().length > 0) {
            navigate(`/?q=${encodeURIComponent(searchValue.trim())}`);
        } else {
            navigate("/");
        }

        setValue("");
        setIsOpen(false);
    };

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const filterdata = useMemo(() => {
        return dataProducts.filter((product) => product.name.toLowerCase().includes(value.toLowerCase()));
    }, [value]);

    return (<div className="flex items-center space-x-2"><div className={`relative hover:lg:w-[20rem] hover:w-[10rem] h-[2rem] flex items-start justify-end group transition-all shadow-md  ${isOpen ? "lg:w-[20rem] w-[10rem]" : "w-0"}`}>
        <button className="absolute -right-2 w-[2rem] h-[2rem] flex justify-center items-center bg-slate-900 group-hover:bg-slate-800 rounded-md"
            onClick={() => {
                if (value.length > 0) {
                    setValue("");
                }
                setIsOpen(!isOpen)

            }}>
            {(value.length < 1 && !isOpen) ? (<AiOutlineSearch color="white" className="text-2xl" />) :
                (
                    <AiOutlineClose color="white" className="text-2xl" />
                )
            }

        </button>
        <input ref={inputRef} type="text" placeholder="Search..." className="w-full h-full pl-2 bg-white outline-none rounded-md " value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => {
            if (e.key === "Enter") {
                handleSearch();
            }
        }} />


        <div className="absolute w-full top-[100%] bg-white shadow-md flex flex-col rounded-b-md rounded-t-md z-50">
            {
                value.length > 0 && (filterdata.length > 0 ? (filterdata.map((product) => (
                    <span key={product.id} className="p-2 hover:bg-slate-200 cursor-pointer" onClick={() => handleSearch(product.name)}>{product.name}</span>
                ))
                ) : (
                    <span className="p-2">no data</span>
                )
                )
            }
        </div>
    </div>
        <div className="flex space-x-1 items-center">
            {isOpen && (
                <button
                    className=" w-[2rem] h-[2rem] ml-[0.2rem] flex justify-center items-center bg-green-600 hover:bg-green-700 text-white text-sm rounded-md"
                    onClick={()=>handleSearch()}
                >
                    <AiOutlineSearch color="white" className="text-2xl" />
                </button>
            )}
        </div></div>);

}