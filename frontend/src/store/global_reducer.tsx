import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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


export const { setGlobalLoading, setNotification } = GlobalSlice.actions
export default GlobalSlice.reducer

