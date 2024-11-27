import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../contexts/context";

export default function LoginForm(){
    const { login } = useAuth();    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent)=>{
        e.preventDefault();
        setError(null);
        try{
            await login({username,password});
        }catch(err: any){
            setError('Invalid username or password!')
            console.error(err)
        }
    }
    

    return(
        <form onSubmit={handleSubmit} className="p-4 bg-light-blue z-10 rounded-xl px-10 font-itim flex flex-col items-center justify-center">
            <div className="font-bold font-itim text-3xl">Login</div>
            <TextField required onChange ={(e)=>setUsername(e.target.value)} className ="font-itim mx-4 my-2" id='standard-basic' label='Username' variant ='standard'/>
            <TextField required onChange ={(e)=>setPassword(e.target.value)}  className ="font-itim mx-4 my-2" type="password" id='standard-basic' label='Password' variant ='standard'/>
            <Button variant="contained" className="my-2 w-full rounded-full" type="submit">Login</Button>
        </form>
    );
}