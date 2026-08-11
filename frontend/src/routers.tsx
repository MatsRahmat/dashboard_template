import * as React from "react"
import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { useSelector } from "react-redux"
import type { RootState } from "./store";

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const accessToken = useSelector((state: RootState) => state.auth);
    if (!accessToken) {
        return <Navigate to={"/login"} replace />
    }
    return children;
}

function PublicRoute({ children }: { children: JSX.Element }) {
    const accessToken = useSelector((state: RootState) => state.auth);
    if (accessToken) {
        return <Navigate to={"/dashboard"} replace />
    }
    return children;
}

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <App />
            </ProtectedRoute>
        ),
        children: [
            {
                path:"/dashboard",
                element: <div>dasboard</div>
            }
        ]
    },
    {
        path: "/login",
        element: (
            <PublicRoute>
                <div>Login page</div>
            </PublicRoute>
        )
    },
    {
        path: "*",
        element: <div>Not Found</div>
    }
]);

export default router