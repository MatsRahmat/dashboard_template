import { createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axios from "../../../services/apiServices";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "../../../store";
import { setGlobalLoading } from "../../../store/global_reducer";
import { LocalStorageService } from "../../../services/localStorageService";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  is_login: boolean;
  error: string | null;
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
  user: UserState;
}

const userInitState: UserState = {
  id: null,
  username: null,
  email: null,
  last_login: null,
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  is_login: false,
};

const userSlice = createSlice({
  name: "user",
  initialState: userInitState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthPayload>) => {
      const payload = action.payload.user;
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
    },
  },
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSucces: (state, action: PayloadAction<AuthPayload>) => {
      state.loading = false;
      state.accessToken = action.payload?.token.access;
      state.refreshToken = action.payload?.token.refresh;
      state.is_login = true;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      // console.trace()
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
      state.is_login = false;
    },
  },
});

export const { loginStart, loginFailure, loginSucces, logout, setLoading } =
  authSlice.actions;
export const { clearUser, setUser } = userSlice.actions;

export type CredentialType = {
  username: string;
  password: string;
};

export const loginAsync =
  (credential: CredentialType) => async (dispatch: AppDispatch) => {
    try {
      dispatch(loginStart());
      dispatch(setGlobalLoading(true));
      const response = await axios.post("/auth/login", credential, {
        withCredentials: true,
      });
      dispatch(loginSucces(response.data));
      dispatch(setUser(response.data));
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(loginFailure(error.response?.data?.message || "Login Failed"));
      } else {
        dispatch(loginFailure(String(error)));
      }
    } finally {
      dispatch(setGlobalLoading(false));
    }
  };

export type RegisterCredential = {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
};

export type RegisterReturn = {
  status: boolean;
  mesg: string;
};

export const registerAsync =
  (credential: RegisterCredential) =>
  async (dispatch: AppDispatch): Promise<RegisterReturn> => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post("/auth/register", credential);
      if (response.status == 201) {
        return { status: true, mesg: "Success register" };
      }
      return { status: false, mesg: "Failed register" };
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        return { status: false, mesg: error.response?.data?.details };
      }
      return { status: false, mesg: String(error) };
    } finally {
      dispatch(setLoading(false));
    }
  };

interface CookieObtainProps {
  accessToken: string | null;
  refreshToken: string | null;
}
export const CookieObtainCookie =
  ({ accessToken, refreshToken }: CookieObtainProps) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      await axios.get("/auth/cookie-obtain-token");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status == 401) {
        dispatch(clearUser());
        dispatch(logout());
      }
    }
  };

export const userReducer = userSlice.reducer;
export const authReducer = authSlice.reducer;
export default authSlice.reducer;
