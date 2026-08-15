import * as React from "react"
import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { useSelector } from "react-redux"
import type { RootState } from "./store";
import LoginPage from "./pages/auth/login";

function logGlobalState(globalState: RootState): void {
    const node_env = import.meta.env.VITE_NODE_ENV ?? ""
    if (node_env == "development") {
        console.log(globalState);
    }
}

function getAccessToken(globalState: RootState): string | null {
    const { auth } = globalState
    let accessToken = null
    if (auth.hasOwnProperty("accessToken")) {
        accessToken = auth.accessToken;
    }
    return accessToken
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const globalState = useSelector((state: RootState) => state);
    logGlobalState(globalState)
    if (!getAccessToken(globalState)) {
        return <Navigate to={"/login"} replace />
    }
    return children;
}

function PublicRoute({ children }: { children: JSX.Element }) {
    const globalState = useSelector((state: RootState) => state);
    logGlobalState(globalState);
    if (getAccessToken(globalState)) {
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
                path: "/dashboard",
                element: <div>dasboard</div>
            }
        ]
    },
    {
        path: "/login",
        element: (
            <PublicRoute>
                <LoginPage />
            </PublicRoute>
        )
    },
    {
        path: "*",
        element: <div>Not Found</div>
    }
]);

export default router