"use client";

import { Button } from "@mui/material";
import { useAuth } from "../contexts/context";
import { usePathname } from 'next/navigation';

export default function Header (){


    const { logout } = useAuth();
    const pathname = usePathname();


    const handleClick=()=>{
        logout()
    }

    return(
    <div className="flex bg-dark-blue absolute top-0 w-full h-fit font-itim text-4xl rounded-b-2xl">
        <div className="m-4 text-white">
        inQuizitive
    </div>
        
        {pathname !== "/login" && (<Button variant="contained" className="absolute right-0 m-4 bg-white text-black" onClick={handleClick}>LOGOUT</Button>)}
    </div>) 

}