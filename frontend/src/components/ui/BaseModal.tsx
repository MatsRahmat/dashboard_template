import * as React from "react";
import ScreenOverlay from "./ScreenOverlay";

export type BaseModalProps = {
    children?: React.JSX.Element;
}
export default function BaseModal({ children }: BaseModalProps) {
    return (
        <React.Fragment>
            <ScreenOverlay />
            <div id="basemodal" className="fixed bg-amber-200 min-w-40 min-h-12 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border rounded-md">
                {children}
            </div>
        </React.Fragment>
    )
}