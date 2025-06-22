import { Navigate } from 'react-router-dom';
const { useSelector } = require('react-redux');
const ProtectedRoute = (props) => {
  const state = useSelector(state => state);
  const isDevBypass = true;

  if (isDevBypass) {
    return <>{props.children}</>;
  }

  const isAuthenticated = state?.account?.isAuthenticated;
  const role = state?.account?.account?.role;

  if (!isAuthenticated || role !== 'ROLE_COMPANY') {
    return <Navigate to='/signin' />;
  }

  return <>{props.children}</>;
};


export default ProtectedRoute;


