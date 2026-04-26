import { Navigate } from "react-router-dom";
import {logout } from '../api/api';

function Logout() {
  function goToLogin() {
    logout();
    return <Navigate to="/login" replace />;
  }
  return goToLogin();
}

export default Logout;