export const setSearchTerm = (term) => ({
  type: "SET_SEARCH_TERM",
  payload: term,
});

export const setStarFilter = (star) => ({
  type: "SET_STAR_FILTER",
  payload: star,
});

export const setDurationFilter = (duration) => ({
  type: "SET_DURATION_FILTER",
  payload: duration,
});

export const setServiceFilter = (service) => ({ // Đổi từ setFeatureFilter
  type: "SET_SERVICE_FILTER",
  payload: service,
});

export const setDeparturePoint = (point) => ({
  type: "SET_DEPARTURE_POINT",
  payload: point,
});

export const setPriceRange = (range) => ({
  type: "SET_PRICE_RANGE",
  payload: range,
});

export const setSortOption = (option) => ({
  type: "SET_SORT_OPTION",
  payload: option,
});

export const setCurrentPage = (page) => ({
  type: "SET_CURRENT_PAGE",
  payload: page,
});

export const setServiceShowCount = (count) => ({ // Đổi từ setFeatureShowCount
  type: "SET_SERVICE_SHOW_COUNT",
  payload: count,
});

export const setNoResults = (value) => ({
  type: "SET_NO_RESULTS",
  payload: value,
});

export const setFilteredYachts = (yachts) => ({
  type: "SET_FILTERED_YACHTS",
  payload: yachts,
});

export const setLoading = (isLoading) => ({
  type: "SET_LOADING",
  payload: isLoading,
});

export const setError = (error) => ({
  type: "SET_ERROR",
  payload: error,
});