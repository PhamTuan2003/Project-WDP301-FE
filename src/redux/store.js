import { applyMiddleware, combineReducers, createStore } from "redux";
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from "redux-thunk";

import userReducer from "./reducer/UserReducer";
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
  account: userReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // chọn reducer muốn lưu (tuỳ bạn)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk)
);

const persistor = persistStore(store);

export { persistor, store };

