import * as React from "react"
import { Fragment } from "react"
import { useSelector } from "react-redux"
import ReactSvg from "../assets/react.svg"
import ViteSvg from "../assets/vite.svg"
import { ButtonAnchor } from "../components/element"
import type { RootState } from "../store"

export default function Navbar() {
    const auth = useSelector((state: RootState) => state.auth);
    if (auth.accessToken) {
        // Navbar ketika sudah login
        return (
            <Fragment>
                <nav className="w-full flex justify-between bg-cyan-500 py-2 not-dark:text-black px-4">
                    <div className="flex gap-2 items-center">
                        <img src={ViteSvg} alt="Logo" className="size-10 aspect-square" />
                        <p>Brand anda</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ButtonAnchor link="" title="Sign in" />
                        <span>|</span>
                        <ButtonAnchor link="" title="Sign up" />
                    </div>
                </nav>
            </Fragment>
        )
    }
    return (
        // Navbar ketika belum login
        <Fragment>
            <nav className="w-full flex justify-between bg-cyan-500 py-2 not-dark:text-black px-4">
                <div className="flex gap-2 items-center">
                    <img src={ViteSvg} alt="Logo" className="size-10 aspect-square" />
                    <p>Brand anda</p>
                </div>
                <div className="flex items-center gap-2">
                    <ButtonAnchor link="/auth/login" title="Sign in" />
                    <span>|</span>
                    <ButtonAnchor link="/auth/register" title="Sign up" />
                </div>
            </nav>
        </Fragment>
    )
}