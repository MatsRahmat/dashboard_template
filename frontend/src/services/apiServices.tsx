import axios from "axios";
import { LocalStorageService } from "./localStorageService";
import type { AuthState } from "../pages/auth/clients/reducer";

const base_url = import.meta.env.VITE_BASE_URL ?? ""
const api = axios.create({
    baseURL: base_url,
    headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
    const auth = LocalStorageService.getItem<AuthState>("auth");
    const token = auth?.accessToken
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;