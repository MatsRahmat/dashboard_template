import * as React from "react"

import { loading_icon } from "../assets/icons"
import ScreenOverlay from "./ScreenOverlay"

export default function LoadingComponent() {
    return (
        <React.Fragment>
            <ScreenOverlay />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <img src={loading_icon} alt="Loading" className="size-14 animate-spin"/>
            </div>
        </React.Fragment>
    )
}