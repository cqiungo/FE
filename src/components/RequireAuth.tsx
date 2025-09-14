import { Navigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import type React from "react";

type Props ={
    children: React.ReactNode
}

export const RequireAuth = ({children} : Props)=>{
    const user =authService.getToken()

    if(!user){
        return <Navigate to='/login' replace></Navigate>
    }
    return (
        <>{children}</>
    )
}