import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import { RestaurantsProvider } from "./RestaurantsContext.jsx";
import Login from "./pages/Login.jsx";
import Verify from "./pages/Verify.jsx";
import Home from "./pages/Home.jsx";
import ItemDetail from "./pages/ItemDetail.jsx";

function GuestOnly() {
  const { token } = useAuth();
  return token ? <Navigate to="/" replace /> : <Outlet />;
}

function Protected() {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return (
    <RestaurantsProvider>
      <Outlet />
    </RestaurantsProvider>
  );
}

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route element={<GuestOnly />}>
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verify />} />
        </Route>
        <Route element={<Protected />}>
          <Route path="/" element={<Home />} />
          <Route path="/item/:id" element={<ItemDetail />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
