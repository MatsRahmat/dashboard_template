import { createSlice } from "@reduxjs/toolkit"
import { AxiosError } from "axios";
import axios from "../../../services/apiServices";
import type { PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch } from "../../../store";

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    loading: boolean;
    is_login: boolean;
    error: string | null
}

interface UserState {
    id: number | null;
    username: string | null;
    email: string | null;
    last_login: string | null;
}

interface AuthPayload {
    token: {
        access: string;
        refresh: string;
    };
    user: UserState
}

const userInitState: UserState = {
    id: null,
    username: null,
    email: null,
    last_login: null
}

const initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null,
    is_login: false
}


const userSlice = createSlice({
    name: "user",
    initialState: userInitState,
    reducers: {
        setUser: (state, action: PayloadAction<AuthPayload>) => {
            const payload = action.payload.user
            state.id = payload.id;
            state.username = payload.username;
            state.email = payload.email;
            state.last_login = payload.last_login;
        },
        clearUser: (state) => {
            state.id = null;
            state.username = null;
            state.email = null;
            state.last_login = null;
        }
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSucces: (state, action: PayloadAction<AuthPayload>) => {
            // console.log({payload:action.payload})
            state.loading = false;
            state.accessToken = action.payload?.token.access
            state.refreshToken = action.payload?.token.refresh
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.error = null;
        }
    }
});

export const { loginStart, loginFailure, loginSucces, logout } = authSlice.actions
export const { clearUser, setUser } = userSlice.actions

export type CredentialType = {
    username: string;
    password: string;
}

export const loginAsync =
    (credential: CredentialType) =>
        async (dispatch: AppDispatch) => {
            try {
                dispatch(loginStart());
                const response = await axios.post("/auth/login", credential);
                dispatch(loginSucces(response.data));
                dispatch(setUser(response.data));
            } catch (error) {
                if (error instanceof AxiosError) {
                    dispatch(loginFailure(error.response?.data?.message || "Login Failed"));
                } else {
                    dispatch(loginFailure(String(error)))
                }
            }
        }

export const userReducer = userSlice.reducer;
export const authReducer = authSlice.reducer;
export default authSlice.reducer;