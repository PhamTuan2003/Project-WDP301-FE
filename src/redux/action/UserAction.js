import { CUSTOMER_REGISTER, FETCH_USER_LOGIN_SUCCES, USER_LOGOUT } from "../type/Type"


export const doLogin = (data, role, idCompany, idCustomer) => {
    return {
        type: FETCH_USER_LOGIN_SUCCES,
        payload: { data, role, idCompany, idCustomer }
    }
}
export const doRegister = () => {
    return {
        type: CUSTOMER_REGISTER
    }
}

export const doLogout = () => {
    return {
        type: USER_LOGOUT,
    }
}
