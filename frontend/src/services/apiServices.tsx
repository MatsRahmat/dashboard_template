import axios from "axios";
import { LocalStorageService } from "./localStorageService";

const api = axios.create({
    baseURL: "",
    headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
    const auth = LocalStorageService.getItem<string>("auth");
    console.log({ auth });
    const token = ""
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;