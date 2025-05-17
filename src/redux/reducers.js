const initialState = {
  searchTerm: "",
  selectedStars: [],
  selectedDurations: [],
  selectedFeatures: [],
  selectedDeparturePoint: "",
  selectedPriceRange: "",
  sortOption: "",
  currentPage: 1,
  featureShowCount: 5,
  noResults: false,
};

const filtersReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload, currentPage: 1 };
    case "SET_STAR_FILTER":
      return {
        ...state,
        selectedStars: state.selectedStars.includes(action.payload)
          ? state.selectedStars.filter((star) => star !== action.payload)
          : [...state.selectedStars, action.payload],
        currentPage: 1,
      };
    case "SET_DURATION_FILTER":
      return {
        ...state,
        selectedDurations: state.selectedDurations.includes(action.payload)
          ? state.selectedDurations.filter(
              (duration) => duration !== action.payload
            )
          : [...state.selectedDurations, action.payload],
        currentPage: 1,
      };
    case "SET_FEATURE_FILTER":
      return {
        ...state,
        selectedFeatures: state.selectedFeatures.includes(action.payload)
          ? state.selectedFeatures.filter(
              (feature) => feature !== action.payload
            )
          : [...state.selectedFeatures, action.payload],
        currentPage: 1,
      };
    case "SET_DEPARTURE_POINT":
      return {
        ...state,
        selectedDeparturePoint: action.payload,
        currentPage: 1,
      };
    case "SET_PRICE_RANGE":
      return { ...state, selectedPriceRange: action.payload, currentPage: 1 };
    case "SET_SORT_OPTION":
      return { ...state, sortOption: action.payload, currentPage: 1 };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: Math.max(1, action.payload) };
    case "SET_FEATURE_SHOW_COUNT":
      return { ...state, featureShowCount: action.payload };
    case "SET_NO_RESULTS":
      return { ...state, noResults: action.payload };
    default:
      return state;
  }
};

export default filtersReducer;
