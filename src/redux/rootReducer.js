import { combineReducers } from "redux";
import {
  yachtReducer,
  servicerReducer,
  imageReducer,
  uiReducer,
  bookingReducer,
  reviewsReducer,
  reviewFormReducer,
  authReducer,
  filtersReducer,
  paymentReducer,
  invoiceReducer,
} from "./reducers";

const rootReducer = combineReducers({
  yacht: yachtReducer,
  services: servicerReducer,
  images: imageReducer,
  ui: uiReducer,
  booking: bookingReducer,
  reviews: reviewsReducer,
  reviewForm: reviewFormReducer,
  auth: authReducer,
  filters: filtersReducer,
  payment: paymentReducer,
  invoice: invoiceReducer,
});

export default rootReducer;
