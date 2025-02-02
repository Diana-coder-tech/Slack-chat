import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/index.jsx";
import { routes } from "./routes.js";

const PrivateRoute = () => {
  const { user } = useAuth();

  return user ? <Outlet /> : <Navigate to={routes.loginPage()} replace />;
};

export default PrivateRoute;
