import * as React from "react"
import { useSelector } from "react-redux"
import ViteSvg from "../assets/vite.svg"
import { ButtonAnchor } from "../components/element"
import type { RootState } from "../store"

export default function Navbar() {
    const { is_login } = useSelector((state: RootState) => state.auth);
    const { username } = useSelector((state: RootState) => state.user)
    const NoAuthRightSide = () => {
        return (
            <React.Fragment>
                <div className="flex items-center gap-2">
                    <ButtonAnchor link="/auth/login" title="Sign in" />
                    <span>|</span>
                    <ButtonAnchor link="/auth/register" title="Sign up" />
                </div>
            </React.Fragment>
        )
    }

    const AuthRightSide = () => {
        return (
            <React.Fragment>
                <div className="flex items-center gap-2">
                    <div>{username}</div>
                    <div className="border rounded-md hover:bg-sky-500 bg-sky-400 transition-all">
                        <ButtonAnchor link="logout" title="Logout" />
                    </div>
                </div>
            </React.Fragment>
        )
    }
    return (
        // Navbar ketika belum login
        <React.Fragment>
            <nav className="w-full flex justify-between bg-cyan-500 py-2 not-dark:text-black px-4">
                <div className="flex gap-2 items-center">
                    <img src={ViteSvg} alt="Logo" className="size-10 aspect-square" />
                    <p>Brand anda</p>
                </div>
                {is_login ? (
                    <AuthRightSide />
                ) : (
                    <NoAuthRightSide />
                )}
            </nav>
        </React.Fragment>
    )
}