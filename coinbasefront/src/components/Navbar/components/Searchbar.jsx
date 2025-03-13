import { useState, useEffect, useRef } from "react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

export function SearchBar() {
    const [value, setValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null);

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
    const shouldExpand = isOpen || value.length > 0;

    return (<div className={`relative hover:w-[20rem] h-[2rem] flex items-start justify-end group transition-all shadow-md  ${isOpen ? "w-[20rem]" : "w-0"}`}>
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
        <input ref={inputRef} type="text" placeholder="Search..." className="w-full h-full pl-2 bg-white outline-none rounded-full " value={value} onChange={(e) => setValue(e.target.value)} />

    </div>);

}