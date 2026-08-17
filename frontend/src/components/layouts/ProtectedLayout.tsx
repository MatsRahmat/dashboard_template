import * as React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ProtectedRoute } from "../ui/guard";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../store";
import { sessionCheck } from "../../store/global_reducer";

export default function ProtectedLayout() {
    const dispatch = useDispatch<AppDispatch>();
    const isValidSession = React.useRef<null | boolean>(null)
    const sessionValidation = async () => {
        try {
            const isValid = await dispatch(sessionCheck());
            isValidSession.current = isValid;
        } catch (errr) {
            //Pass
        }

    }
    // On Mounted effect
    React.useEffect(() => {
        if (isValidSession != null) {
            setTimeout(sessionValidation, 2000)
            
        } else {
            console.log("Session checking")
        }
    }, [])
    return (
        <ProtectedRoute>
            <React.Fragment>
                <Outlet />
                <Navigate to="/dashboard" />
            </React.Fragment>
        </ProtectedRoute>
    )
}