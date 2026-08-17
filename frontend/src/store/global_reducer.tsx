import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "./index";
import axios from "../services/apiServices"
import { AxiosError } from "axios";
import { logout } from "../pages/auth/clients/reducer";
import axios_ori from "axios"

export interface NotificationInterface {
    show: boolean;
    title?: string;
    mesg?: string;
}
export interface GlobalState {
    is_loading: boolean;
    notif: NotificationInterface
}

const initGlobalState: GlobalState = {
    is_loading: false,
    notif: {
        show: false,
        mesg: "",
        title: ""
    }
}
const GlobalSlice = createSlice({
    name: "global",
    initialState: initGlobalState,
    reducers: {
        setGlobalLoading: (state, action: PayloadAction<boolean>) => {
            console.trace("global loading")
            state.is_loading = action.payload
        },
        setNotification: (state, action: PayloadAction<NotificationInterface>) => {
            // state.notif.show = action.payload.show
            // state.notif.title = action.payload.title
            // state.notif.mesg = action.payload.mesg
            state.notif = action.payload
        }
    }
});

export const sessionCheck = () => async (dispatch: AppDispatch): Promise<boolean> => {
    let valid = true;
    try {
        const response = await axios.get("/auth/user");
        if (response.status == 200) {
            valid = true
        }
    } catch (error) {
        valid = false
        if (error instanceof AxiosError) {
            if (error.response?.status == axios_ori.HttpStatusCode.Unauthorized) {
                dispatch(logout())
                console.log(error)
            }
        } else {
            console.log(error)
        }
    }
    return valid
}

export const { setGlobalLoading, setNotification } = GlobalSlice.actions
export default GlobalSlice.reducer
