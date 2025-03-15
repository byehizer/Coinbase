import { useState, useEffect, useRef, useMemo } from "react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

export function SearchBar() {
    const [value, setValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null);

    const DATA = [
        {
            id: 1,
            label: "Dolar 1999"
        },
        {
            id: 2,
            label: "Euro 2000"
        },
        {
            id: 3,
            label: "Yen 1459"
        },
        {
            id: 4,
            label: "Dolar 2010"
        },
        {
            id: 5,
            label: "Dolar 2024"
        }
    ]



    useEffect(() => {
        if (value.length > 0) {
            setIsOpen(true);
        }
    }, [value]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const filterdata = useMemo(() => {
        return DATA.filter((product) => product.label.toLowerCase().includes(value.toLowerCase()));
    }, [value]);

    return (<div className={`relative hover:md:w-[20rem] hover:w-[10rem] h-[2rem] flex items-start justify-end group transition-all shadow-md  ${isOpen ? "md:w-[20rem] w-[10rem]" : "w-0"}`}>
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
        <input ref={inputRef} type="text" placeholder="Search..." className="w-full h-full pl-2 bg-white outline-none rounded-md " value={value} onChange={(e) => setValue(e.target.value)} />
        <div className="absolute w-full top-[100%] bg-white shadow-md flex flex-col rounded-b-md rounded-t-md">
            {
                value.length > 0 && (filterdata.length > 0 ? (filterdata.map((product) => (
                    <span key={product.id} className="p-2 hover:bg-slate-200 cursor-pointer" onClick={() => setValue(product.label)}>{product.label}</span>
                ))
                ) : (
                    <span className="p-2">no data</span>
                )
                )
            }
        </div>
    </div>);

}