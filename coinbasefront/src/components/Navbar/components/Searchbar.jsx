import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

export function SearchBar() {
    const [value, setValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    return (<div className={`relative hover:w-[20rem] h-[2rem] flex items-start justify-end group transition-all shadow-md ${value.length === 0 ? "w-0" : "w-[20rem]"}  ${isOpen ? "w-[20rem]" : "w-0"}`}>
        <button className="absolute -right-2 w-[2rem] h-[2rem] flex justify-center items-center bg-slate-900 group-hover:bg-slate-800 rounded-md" onClick={() => setIsOpen(!isOpen)}>
            <AiOutlineSearch color="white" className="text-2xl" />
        </button>
        <input type="text" placeholder="Search..." className="w-full h-full pl-2 bg-white outline-none rounded-full " value={value} onChange={(e) => setValue(e.target.value)} />

    </div>);

}