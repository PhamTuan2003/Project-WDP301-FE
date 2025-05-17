import { createStore, combineReducers } from "redux";
import filtersReducer from "./reducers";

const rootReducer = combineReducers({
  filters: filtersReducer,
});

const store = createStore(rootReducer);

export default store;
