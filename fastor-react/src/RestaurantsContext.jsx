import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchRestaurants } from "./api.js";
import { useAuth } from "./AuthContext.jsx";

const RestaurantsContext = createContext(null);

export function RestaurantsProvider({ children }) {
  const { token, signOut } = useAuth();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const load = useCallback(
    (signal) => {
      setStatus("loading");
      setError("");
      fetchRestaurants(token, signal)
        .then((list) => {
          setItems(list);
          setStatus("ready");
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          if (err.status === 401) {
            signOut();
            return;
          }
          setError(err.message);
          setStatus("error");
        });
    },
    [token, signOut]
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const value = useMemo(() => ({ items, status, error, reload: () => load() }), [items, status, error, load]);
  return <RestaurantsContext.Provider value={value}>{children}</RestaurantsContext.Provider>;
}

export const useRestaurants = () => useContext(RestaurantsContext);
