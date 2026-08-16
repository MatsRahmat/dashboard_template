import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { logout, clearUser } from "../pages/auth/clients/reducer"

export default function logoutHooks() {
    const dispatch = useDispatch<AppDispatch>();
    function logoutAction() {
        dispatch(logout());
        dispatch(clearUser());
    }
    return logoutAction
}