import { Navigate } from "react-router-dom";
import { getUserRole } from "../utils/auth";

function AdminRoute({ children }) {
  if (getUserRole() !== "admin") {
    return <Navigate to="/" />;
  }
  return children;
}

export default AdminRoute;
