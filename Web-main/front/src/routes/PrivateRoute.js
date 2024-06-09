import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Login.Status";

const PrivateRoute = ({ component: element }) => {
  const { isLoggedIn, IsAdmin } = useAuth();

  if (isLoggedIn && IsAdmin) {
    console.log(element);
    return element;
  } else {
    alert("접근 권한이 없습니다");
    return <Navigate to="/" />;
  }
};

export default PrivateRoute;
