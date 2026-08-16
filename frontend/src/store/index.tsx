import { configureStore } from "@reduxjs/toolkit";
import AuthReducer, { userReducer } from "../pages/auth/clients/reducer"
// import thunk from "redux-thunk";
import { createPersistMiddleware, loadPersistedState } from "./middleware/persistMiddleware";
import GlobalReducer from "./global_reducer"

const persistedKeys = ["auth", "user"];
const persistedState = loadPersistedState(persistedKeys);
const persistMiddleware = createPersistMiddleware({ keys: persistedKeys });

export const store = configureStore({
    reducer: {
        ///@ts-ignore
        auth: AuthReducer,
        user: userReducer,
        global: GlobalReducer,
    },
    preloadedState: persistedState,
    ///@ts-ignore
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat(persistMiddleware),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;