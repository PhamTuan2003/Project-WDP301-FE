import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = (props) => {
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);
    const role = useSelector(state => state.account.account.role);


    if (!isAuthenticated || role !== 'ROLE_COMPANY') {
        return <Navigate to='/signin'></Navigate>
    }



    return (

        <>
            {props.children}
        </>
    );
};

export default ProtectedRoute;