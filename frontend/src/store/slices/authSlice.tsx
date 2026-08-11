import { createSlice } from "@reduxjs/toolkit"
import { AxiosError } from "axios";
import axios from "../../services/apiServices";
import type { PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch } from "../index";

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: string | null
}

const initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSucces: (state, action: PayloadAction<{ accessToken: string; refreshToken: string; }>) => {
            state.loading = false;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
        }
    }
});

export const { loginStart, loginFailure, loginSucces, logout } = authSlice.actions

export const loginAsync =
    (credential: { username: string; password: string; }) =>
        async (dispatch: AppDispatch) => {
            try {
                dispatch(loginStart());
                const response = await axios.post("/auth/login", credential);
                dispatch(loginSucces(response.data));
            } catch (error) {
                if (error instanceof AxiosError) {
                    dispatch(loginFailure(error.response?.data?.message || "Login Failed"));
                }
            }
        }

export default authSlice.reducer;