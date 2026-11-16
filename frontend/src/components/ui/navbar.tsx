import * as React from "react"
import { useSelector } from "react-redux"
import ViteSvg from "../../assets/vite.svg"
import { ButtonAnchor } from "./element"
import type { RootState } from "../../store"
import { notification_dark } from "../../assets/icons/index";
import useNotification from "../../hooks/useNotification"

interface NotificationProps {
    userId: number
}
const Notification = ({ userId }: NotificationProps) => {
    const { } = useNotification(userId)
    return (
        <div>
            <button className="relative cursor-pointer transition-all hover:scale-[1.07]">
                <img src={notification_dark} alt="Notification" className="size-7" />
                <p className="bg-red-500 absolute top-0 left-0 size-3 rounded-full"></p>
            </button>
        </div>
    )
}

export default function Navbar() {
    const { is_login } = useSelector((state: RootState) => state.auth);
    const { username, id } = useSelector((state: RootState) => state.user)

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
                    <Notification userId={id} />
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
            <nav className="w-full h-full flex justify-between bg-cyan-500 py-2 px-5 not-dark:text-black">
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