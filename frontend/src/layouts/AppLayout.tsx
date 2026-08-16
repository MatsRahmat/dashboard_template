import * as React from "react"
import { Outlet } from "react-router-dom"
import Navbar from "../components/navbar"
import Notification from "../components/Notification"
import LoadingComponent from "../components/loadingComponent"
import { useDispatch, useSelector } from "react-redux"
import { type AppDispatch, type RootState } from "../store"
import { setNotification } from "../store/global_reducer"

export default function AppLayout() {
    const { is_loading, notif } = useSelector((state: RootState) => state.global);
    const dispatch = useDispatch<AppDispatch>();
    const handleCloseNotif = () => {
        dispatch(setNotification({ show: false, mesg: "", title: "" }));
    }
    return (
        <React.Fragment>
            <Navbar />
            <div>
                <Outlet />
            </div>
            {notif.show && (
                <Notification onClose={handleCloseNotif} mesg={notif.mesg ?? ""} title={notif.mesg ?? ""} />
            )}
            {is_loading && (
                <LoadingComponent />
            )}
        </React.Fragment>
    )
}