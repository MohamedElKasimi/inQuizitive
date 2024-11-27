'use client'

import Header from "../components/header"
import LoginForm from "./Form"

export default function Login(){
    return(
    <div className="flex items-center justify-center h-screen">
        <Header></Header>
        <LoginForm></LoginForm>
     </div>
    ) 

}