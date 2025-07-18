// import React from "react";
// import { Navigate } from "react-router-dom";
// const { useSelector } = require("react-redux");
// const ProtectedRoute = (props) => {
//   const state = useSelector((state) => state);
//   const isDevBypass = true;

//   if (isDevBypass) {
//     return <>{props.children}</>;
//   }

//   const isAuthenticated = state?.account?.isAuthenticated;
//   const role = state?.account?.account?.role;
//   // Role là "COMAPNY", "CUSTOMER", "ADMIN" là cách viết chuẩn ở mongobdB
//   if (!isAuthenticated || role !== "ROLE_COMPANY") {
//     return <Navigate to="/signin" />;
//   }

//   return <>{props.children}</>;
// };

// export default ProtectedRoute;

import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = useSelector((state) => state?.account?.isAuthenticated);
  const role = useSelector((state) => state?.account?.customer?.role);
  const authChecked = useSelector((state) => state?.account?.authChecked);

  if (!authChecked) {
    return null; // hoặc Loading UI
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;