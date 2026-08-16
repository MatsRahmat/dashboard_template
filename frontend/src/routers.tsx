import * as React from "react"
import { createBrowserRouter, Outlet } from "react-router-dom";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import AppLayout from "./layouts/AppLayout";
import PublicLayout from "./layouts/PublicLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Dashboard from "./pages/dasboard";
import LogoutPage from "./pages/auth/logout";


const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            // {
            //     path: "/",
            //     element: <div>lading page</div>,
            // },
            {
                path: "/",
                element: <ProtectedLayout />,
                children: [
                    {
                        path: "/dashboard",
                        element: <Dashboard />
                    }
                ]
            },
            {
                path: "/auth",
                element: <PublicLayout />,
                children: [
                    {
                        path: "/auth/login",
                        element: <LoginPage />
                    },
                    {
                        path: "/auth/register",
                        element: <RegisterPage />
                    }
                ]
            },
            {
                path:"/logout",
                element: <LogoutPage />
            },
            {
                path: "*",
                element: <div>Not found</div>
            }
        ]
    },
    // {
    //     path: "/login",
    //     element: (
    //         <PublicRoute>
    //             <LoginPage />
    //         </PublicRoute>
    //     )
    // },
    // {
    //     path: "/register",
    //     element: (
    //         <PublicRoute>
    //             <RegisterPage />
    //         </PublicRoute>
    //     )
    // },
    // {
    //     path: "*",
    //     element: <div>Not Found</div>
    // }
]);

// const router = createBrowserRouter([
//     {
//         path: "/",
//         element: (
//             <ProtectedRoute>
//                 <App />
//             </ProtectedRoute>
//         ),
//         children: [
//             {
//                 path: "/dashboard",
//                 element: <div>dasboard</div>
//             }
//         ]
//     },
//     {
//         path: "/login",
//         element: (
//             <PublicRoute>
//                 <LoginPage />
//             </PublicRoute>
//         )
//     },
//     {
//         path: "/register",
//         element: (
//             <PublicRoute>
//                 <RegisterPage />
//             </PublicRoute>
//         )
//     },
//     {
//         path: "*",
//         element: <div>Not Found</div>
//     }
// ]);

export default router