import * as React from "react"
import { Outlet, Navigate } from "react-router-dom"
import { PublicRoute } from "../ui/guard"

export default function PublicLayout() {
    return (
        <PublicRoute>
            <React.Fragment>
                <Outlet />
                <Navigate to="/auth/login" key="auth" />
            </React.Fragment>
        </PublicRoute>
    )
}