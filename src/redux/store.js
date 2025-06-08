import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import {
  authReducer,
  bookingReducer,
  consultationReducer,
  filtersReducer,
  imageReducer,
  reviewFormReducer,
  reviewsReducer,
  servicerReducer,
  uiReducer,
  yachtReducer,
} from "./reducers";

const rootReducer = combineReducers({
  yacht: yachtReducer,
  images: imageReducer,
  ui: uiReducer,
  booking: bookingReducer,
  reviews: reviewsReducer,
  filters: filtersReducer,
  consultation: consultationReducer,
  reviewForm: reviewFormReducer,
  auth: authReducer,
  services: servicerReducer,
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

console.log("Redux Store initialized:", store.getState());

export default store;
