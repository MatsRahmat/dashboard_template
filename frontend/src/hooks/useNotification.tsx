import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store";
import { logout, clearUser, CookieObtainCookie } from "../pages/auth/clients/reducer"

const baseUrl = String(import.meta.env.VITE_BASE_URL ?? "");

const useNotification = (userId: number | string) => {
  const MAX_RETRY = 5;
  let RETRY = 0;
  const dispatch = useDispatch<AppDispatch>();
  // const { accessToken, refreshToken } = useSelector((state: RootState) => state.auth);
  const [mesg, setMesg] = React.useState<string[]>([]);

  React.useEffect(() => {
    const eventSource = new EventSource(
      baseUrl.concat("/notification/dashboard/", String(userId)),
      { withCredentials: true },
    );

    // Handle ketika ada event error
    eventSource.addEventListener("error", (event: MessageEvent) => {
      console.log("Event listener error:", event.data);
      if (event.data?.includes("Unauthorized")) {
         console.log("Unauthorized, retry: ", RETRY);
        if (RETRY > MAX_RETRY) {
          dispatch(clearUser());
          dispatch(logout());
          eventSource.close();
          return;
        }
        RETRY += 1
      }
    });

    eventSource.onmessage = (event: MessageEvent) => {
      console.group("on message event source");
      console.log(event);
      console.groupEnd();
      setMesg((prev) => [...prev, event.data]);
    };

    eventSource.onerror = (err) => {
      console.log("SSE Error:", err);
      if (err instanceof MessageEvent) {
        if (err.data?.includes("Unauthorized")) {
          console.log("Unauthorized, retry: ", RETRY);
          if (RETRY > MAX_RETRY) {
          dispatch(clearUser());
          dispatch(logout());
          eventSource.close();
          return;
        }
          RETRY += 1
        }
      }
    };

    eventSource.onopen = (ev: Event) => {
      console.group("on open event source");
      console.log(ev);
      console.groupEnd();
    };

    return () => {
      if (eventSource instanceof EventSource) {
        eventSource.close();
      }
    };
  }, [userId]);
  return { mesg };
};

export default useNotification;
