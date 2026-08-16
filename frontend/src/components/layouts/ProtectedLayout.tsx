import * as React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ProtectedRoute } from "../ui/guard";

export default function ProtectedLayout() {
    return (
        <ProtectedRoute>
            <React.Fragment>
                <Outlet />
                <Navigate to="/dashboard" />
            </React.Fragment>
        </ProtectedRoute>
    )
}