import * as React from "react";
import { Navigate } from "react-router-dom";
import logoutHooks from "../../hooks/logout";


export default function LogoutPage() {
    const logout = logoutHooks();
    React.useEffect(() => {
        logout()
    }, [])
    return <Navigate to="/auth/login" replace />
}