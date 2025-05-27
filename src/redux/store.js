import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import {
  yachtReducer,
  imageReducer,
  uiReducer,
  bookingReducer,
  reviewsReducer,
  filtersReducer,
  consultationReducer,
  authReducer,
  reviewFormReducer,
  servicerReducer,
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
  servicer: servicerReducer,
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

console.log("Redux Store initialized:", store.getState());

export default store;
