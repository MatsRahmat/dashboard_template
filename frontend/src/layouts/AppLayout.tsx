import * as React from "react"
import { Outlet } from "react-router-dom"
import Navbar from "../components/navbar"

export default function AppLayout() {
    return (
        <React.Fragment>
            <div>
                <Navbar/>
                <Outlet />
            </div>
        </React.Fragment>
    )
}