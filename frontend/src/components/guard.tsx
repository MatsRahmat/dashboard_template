import * as React from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../store/index";
import { Navigate } from "react-router-dom";

function logGlobalState(globalState: RootState): void {
    const node_env = import.meta.env.VITE_NODE_ENV ?? ""
    if (node_env == "development") {
        console.log(globalState);
    } else {
        // Reasign sebaggai function kosong
        console.log = function () { }
    }
}

function getAccessToken(globalState: RootState): boolean {
    const { auth } = globalState
    console.log({auth})
    return auth.is_login;
}

export function ProtectedRoute({ children }: { children: React.JSX.Element }) {
    const globalState = useSelector((state: RootState) => state);
    logGlobalState(globalState)
    if (!getAccessToken(globalState)) {
        return <Navigate to={"/login"} replace />
    }
    return children;
}

export function PublicRoute({ children }: { children: React.JSX.Element }) {
    const globalState = useSelector((state: RootState) => state);
    logGlobalState(globalState);
    if (getAccessToken(globalState)) {
        return <Navigate to={"/dashboard"} replace />
    }
    return children;
}