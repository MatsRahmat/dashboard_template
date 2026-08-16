import * as React from "react"
import { Outlet } from "react-router-dom"
import Navbar from "../ui/navbar"
import Notification from "../ui/Notification"
import LoadingComponent from "../ui/loadingComponent"
import { useDispatch, useSelector } from "react-redux"
import { type AppDispatch, type RootState } from "../../store"
import { setNotification } from "../../store/global_reducer"

export default function AppLayout() {
    const { is_loading, notif } = useSelector((state: RootState) => state.global);
    const dispatch = useDispatch<AppDispatch>();
    const handleCloseNotif = () => {
        dispatch(setNotification({ show: false, mesg: "", title: "" }));
    }
    return (
        <React.Fragment>
            <div className="flex flex-col h-dvh">
                <div className="flex-none h-16">
                    <Navbar />
                </div>
                <div className="bg-cyan-500 flex-auto flex ">
                    <div className="flex-none transition-all bg-cyan-500 w-10 sm:w-32 md:w-44 xl:w-56">
                        sidebar
                    </div>
                    <div className="flex-auto bg-slate-100 rounded-2xl border p-2">
                        <Outlet />
                    </div>
                </div>
                {notif.show && (
                    <Notification onClose={handleCloseNotif} mesg={notif.mesg ?? ""} title={notif.mesg ?? ""} />
                )}
                {is_loading && (
                    <LoadingComponent />
                )}
            </div>
        </React.Fragment>
    )
}