import type { Middleware } from "@reduxjs/toolkit"
import { LocalStorageService } from "../../services/localStorageService";

interface PersistConfig {
    keys: string[];
}

// set item ke local storage setiap ada perubahan pada state
export const createPersistMiddleware = (config: PersistConfig): Middleware => {
    return (storedApi) => (next) => (action) => {
        const result = next(action);
        
        config.keys.forEach((key) => {
            const state = storedApi.getState();
            if (state[key] != undefined) {
                console.log({state, key})
                LocalStorageService.setItem(key, state[key]);
            }
        });
        return result;
    }
}

// Load state dari local storage
export const loadPersistedState = (keys: string[]) => {
    const persistedState: Record<string, any> = {};
    keys.forEach((key) => {
        const item = LocalStorageService.getItem(key);
        if (item) {
            persistedState[key] = item;
        }
    });
    return persistedState;
}