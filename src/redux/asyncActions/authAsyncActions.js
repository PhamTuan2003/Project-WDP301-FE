import { setAuthenticated } from "../actions/authActions";

export const initializeAuth = () => (dispatch) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("customer");
  if (token && user) {
    try {
      const userData = JSON.parse(user);
      dispatch(setAuthenticated(userData));
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("customer");
    }
  }
};

export const fetchCustomerIdFromStorage = () => (dispatch) => {
  try {
    const customerData = localStorage.getItem("customer");
    if (customerData) {
      const parsedCustomer = JSON.parse(customerData);
      dispatch(setAuthenticated(parsedCustomer));
      return parsedCustomer;
    }
    return null;
  } catch (error) {
    console.error("Error fetching customer from storage:", error);
    return null;
  }
};
