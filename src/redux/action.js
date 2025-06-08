// === FILTERS ACTIONS (Giữ nguyên) ===
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

export const setServiceFilter = (service) => ({
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

export const setServiceShowCount = (count) => ({
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

export const setSelectedStars = (stars) => ({
  type: "SET_SELECTED_STARS",
  payload: stars,
});

export const setSelectedDurations = (durations) => ({
  type: "SET_SELECTED_DURATIONS",
  payload: durations,
});

export const setSelectedServices = (services) => ({
  type: "SET_SELECTED_SERVICES",
  payload: services,
});

// === YACHT ACTIONS ===
export const fetchYachtRequest = () => ({
  type: "FETCH_YACHT_REQUEST",
});

export const fetchYachtSuccess = (yacht) => ({
  type: "FETCH_YACHT_SUCCESS",
  payload: yacht,
});

export const fetchYachtFailure = (error) => ({
  type: "FETCH_YACHT_FAILURE",
  payload: error,
});

export const clearYacht = () => ({
  type: "CLEAR_YACHT",
});

// === IMAGE ACTIONS ===
export const fetchImagesRequest = () => ({
  type: "FETCH_IMAGES_REQUEST",
});

export const fetchImagesSuccess = (images) => ({
  type: "FETCH_IMAGES_SUCCESS",
  payload: images,
});

export const fetchImagesFailure = (error) => ({
  type: "FETCH_IMAGES_FAILURE",
  payload: error,
});

export const setCurrentImageIndex = (index) => ({
  type: "SET_CURRENT_IMAGE_INDEX",
  payload: index,
});

export const nextSlide = () => ({
  type: "NEXT_SLIDE",
});

export const prevSlide = () => ({
  type: "PREV_SLIDE",
});

export const setImageHovering = (isHovering) => ({
  type: "SET_IMAGE_HOVERING",
  payload: isHovering,
});

// === UI ACTIONS ===
export const setActiveTab = (tabIndex) => ({
  type: "SET_ACTIVE_TAB",
  payload: tabIndex,
});

export const openRoomModal = (room) => ({
  type: "OPEN_ROOM_MODAL",
  payload: room,
});

export const closeRoomModal = () => ({
  type: "CLOSE_ROOM_MODAL",
});

export const openBookingModal = () => ({
  type: "OPEN_BOOKING_MODAL",
});

export const closeBookingModal = () => ({
  type: "CLOSE_BOOKING_MODAL",
});

// === BOOKING ACTIONS (Loại bỏ charter-related actions) ===
export const fetchRoomsRequest = () => ({
  type: "FETCH_ROOMS_REQUEST",
});
export const setConsultationRequest = (value) => ({
  type: "SET_CONSULTATION_REQUEST",
  payload: value,
});
export const fetchSchedulesRequest = () => ({
  type: "FETCH_SCHEDULES_REQUEST",
});

export const fetchSchedulesSuccess = (schedules) => ({
  type: "FETCH_SCHEDULES_SUCCESS",
  payload: schedules,
});
export const setCurrentBookingId = (bookingId) => ({
  type: "SET_CURRENT_BOOKING_ID",
  payload: bookingId,
});
export const fetchSchedulesFailure = (error) => ({
  type: "FETCH_SCHEDULES_FAILURE",
  payload: error,
});

export const fetchRoomsSuccess = (rooms, schedules) => ({
  type: "FETCH_ROOMS_SUCCESS",
  payload: { rooms, schedules },
});

export const fetchRoomsFailure = (error) => ({
  type: "FETCH_ROOMS_FAILURE",
  payload: error,
});

export const incrementRoomQuantity = (roomId) => ({
  type: "INCREMENT_ROOM_QUANTITY",
  payload: roomId,
});

export const decrementRoomQuantity = (roomId) => ({
  type: "DECREMENT_ROOM_QUANTITY",
  payload: roomId,
});

export const setEditingBookingId = (bookingId) => ({
  type: "SET_EDITING_BOOKING_ID",
  payload: bookingId,
});

export const setSelectedSchedule = (scheduleId) => ({
  type: "SET_SELECTED_SCHEDULE",
  payload: scheduleId,
});

export const setSelectedMaxPeople = (maxPeople) => ({
  type: "SET_SELECTED_MAX_PEOPLE",
  payload: maxPeople,
});

export const updateBookingForm = (field, value) => ({
  type: "UPDATE_BOOKING_FORM",
  payload: { field, value },
});

export const setMaxPeopleOptions = (options) => ({
  type: "SET_MAX_PEOPLE_OPTIONS",
  payload: options,
});

export const setGuestCounterOpen = (isOpen) => ({
  type: "SET_GUEST_COUNTER_OPEN",
  payload: isOpen,
});

export const updateAdults = (increment) => ({
  type: "UPDATE_ADULTS",
  payload: increment,
});

export const updateChildren = (increment) => ({
  type: "UPDATE_CHILDREN",
  payload: increment,
});

export const clearSelection = () => ({
  type: "CLEAR_SELECTION",
});

export const resetBookingForm = () => ({
  type: "RESET_BOOKING_FORM",
});

export const genericBookingRequest = () => ({
  type: "GENERIC_BOOKING_REQUEST",
});
export const genericBookingSuccess = (bookingData) => ({
  type: "GENERIC_BOOKING_SUCCESS",
  payload: bookingData,
});
export const genericBookingFailure = (error) => ({
  type: "GENERIC_BOOKING_FAILURE",
  payload: error,
});

export const confirmConsultationRequest = () => ({
  type: "CONFIRM_CONSULTATION_REQUEST",
});
export const confirmConsultationSuccess = (bookingData) => ({
  type: "CONFIRM_CONSULTATION_SUCCESS",
  payload: bookingData,
});
export const confirmConsultationFailure = (error) => ({
  type: "CONFIRM_CONSULTATION_FAILURE",
  payload: error,
});

// === REVIEW ACTIONS ===
export const fetchReviewsRequest = () => ({
  type: "FETCH_REVIEWS_REQUEST",
});

export const fetchReviewsSuccess = (reviewsData) => ({
  type: "FETCH_REVIEWS_SUCCESS",
  payload: reviewsData,
});

export const fetchReviewsFailure = (error) => ({
  type: "FETCH_REVIEWS_FAILURE",
  payload: error,
});

export const setReviewSearchTerm = (term) => ({
  type: "SET_REVIEW_SEARCH_TERM",
  payload: term,
});

export const setReviewCurrentPage = (page) => ({
  type: "SET_REVIEW_CURRENT_PAGE",
  payload: page,
});

export const setBookingErrors = (errors) => ({
  type: "SET_BOOKING_ERRORS",
  payload: errors,
});

export const requestConsultation = (consultationData) => ({
  type: "REQUEST_CONSULTATION",
  payload: consultationData,
});

export const fetchYachtImages = (yachtId) => ({
  type: "FETCH_YACHT_IMAGES",
  payload: yachtId,
});

export const fetchReviews = (yachtId, page = 1, search = "") => ({
  type: "FETCH_REVIEWS",
  payload: { yachtId, page, search },
});

export const submitReview = (reviewData) => ({
  type: "SUBMIT_REVIEW",
  payload: reviewData,
});

export const setCustomerId = (customerId) => ({
  type: "SET_CUSTOMER_ID",
  payload: customerId,
});

export const setUserRating = (rating) => ({
  type: "SET_USER_RATING",
  payload: rating,
});

export const setReviewDescription = (description) => ({
  type: "SET_REVIEW_DESCRIPTION",
  payload: description,
});

export const openRegulationsWindow = () => ({
  type: "OPEN_REGULATIONS_WINDOW",
});

export const closeRegulationsWindow = () => ({
  type: "CLOSE_REGULATIONS_WINDOW",
});

export const closeFaqWindow = () => ({
  type: "CLOSE_FAQ_WINDOW",
});

export const setSubmitting = (isSubmitting) => ({
  type: "SET_SUBMITTING",
  payload: isSubmitting,
});

export const requestConsultationRequest = () => ({
  type: "REQUEST_CONSULTATION_REQUEST",
});

export const requestConsultationSuccess = () => ({
  type: "REQUEST_CONSULTATION_SUCCESS",
});

export const requestConsultationFailure = (error) => ({
  type: "REQUEST_CONSULTATION_FAILURE",
  payload: error,
});

export const submitReviewRequest = () => ({
  type: "SUBMIT_REVIEW_REQUEST",
});

export const submitReviewSuccess = () => ({
  type: "SUBMIT_REVIEW_SUCCESS",
});

export const submitReviewFailure = (error) => ({
  type: "SUBMIT_REVIEW_FAILURE",
  payload: error,
});

export const checkAuthStatus = () => ({
  type: "CHECK_AUTH_STATUS",
});

export const setAuthenticated = (user) => ({
  type: "SET_AUTHENTICATED",
  payload: user,
});

export const loginRequest = () => ({
  type: "LOGIN_REQUEST",
});

export const loginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

export const loginFailure = (error) => ({
  type: "LOGIN_FAILURE",
  payload: error,
});

export const logout = () => ({
  type: "LOGOUT",
});

export const registerRequest = () => ({
  type: "REGISTER_REQUEST",
});

export const registerSuccess = (user) => ({
  type: "REGISTER_SUCCESS",
  payload: user,
});

export const registerFailure = (error) => ({
  type: "REGISTER_FAILURE",
  payload: error,
});

export const clearAuthError = () => ({
  type: "CLEAR_AUTH_ERROR",
});

// === THÊM CÁC ACTIONS MỚI ===
export const setFormValidation = (field, isValid, errorMessage) => ({
  type: "SET_FORM_VALIDATION",
  payload: { field, isValid, errorMessage },
});

export const clearAllErrors = () => ({
  type: "CLEAR_ALL_ERRORS",
});

// Customer bookings actions
export const fetchCustomerBookingsRequest = () => ({
  type: "FETCH_CUSTOMER_BOOKINGS_REQUEST",
});

export const fetchCustomerBookingsSuccess = (bookings) => ({
  type: "FETCH_CUSTOMER_BOOKINGS_SUCCESS",
  payload: bookings,
});

export const fetchCustomerBookingsFailure = (error) => ({
  type: "FETCH_CUSTOMER_BOOKINGS_FAILURE",
  payload: error,
});

// Booking detail actions
export const fetchBookingDetailRequest = () => ({
  type: "FETCH_BOOKING_DETAIL_REQUEST",
});

export const fetchBookingDetailSuccess = (bookingDetail) => ({
  type: "FETCH_BOOKING_DETAIL_SUCCESS",
  payload: bookingDetail,
});

export const fetchBookingDetailFailure = (error) => ({
  type: "FETCH_BOOKING_DETAIL_FAILURE",
  payload: error,
});

export const updateBookingStatusInList = (bookingId, status) => ({
  type: "UPDATE_BOOKING_STATUS_IN_LIST",
  payload: { bookingId, status },
});

// Confirmation Modal Actions
export const openConfirmationModal = (confirmationData) => ({
  type: "OPEN_CONFIRMATION_MODAL",
  payload: confirmationData,
});

export const closeConfirmationModal = () => ({
  type: "CLOSE_CONFIRMATION_MODAL",
});

export const setConfirmationData = (data) => ({
  type: "SET_CONFIRMATION_DATA",
  payload: data,
});

// Transaction Modal Actions
export const openTransactionModal = (bookingId) => ({
  type: "OPEN_TRANSACTION_MODAL",
  payload: { bookingId },
});

export const closeTransactionModal = () => ({
  type: "CLOSE_TRANSACTION_MODAL",
});

export const setActivePaymentTab = (tabIndex) => ({
  type: "SET_ACTIVE_PAYMENT_TAB",
  payload: tabIndex,
});

// Invoice Modal Actions
export const openInvoiceModal = (invoiceData) => ({
  type: "OPEN_INVOICE_MODAL",
  payload: invoiceData,
});

export const closeInvoiceModal = () => ({
  type: "CLOSE_INVOICE_MODAL",
});

export const setInvoiceData = (invoiceData) => ({
  type: "SET_INVOICE_DATA",
  payload: invoiceData,
});

// Payment Processing Actions
export const createTransactionRequest = () => ({
  type: "CREATE_TRANSACTION_REQUEST",
});

export const createTransactionSuccess = (transaction) => ({
  type: "CREATE_TRANSACTION_SUCCESS",
  payload: transaction,
});

export const createTransactionFailure = (error) => ({
  type: "CREATE_TRANSACTION_FAILURE",
  payload: error,
});

export const setQRCodeData = (qrData) => ({
  type: "SET_QR_CODE_DATA",
  payload: qrData,
});

export const clearQRCodeData = () => ({
  type: "CLEAR_QR_CODE_DATA",
});

// Booking Status Actions
export const updateBookingStatusAction = (bookingId, status) => ({
  type: "UPDATE_BOOKING_STATUS",
  payload: { bookingId, status },
});

export const confirmBookingRequest = () => ({
  type: "CONFIRM_BOOKING_REQUEST",
});
// Update rooms
export const updateRooms = (rooms) => ({
  type: "UPDATE_ROOMS",
  payload: rooms,
});

// Clear consultation
export const clearConsultation = () => ({
  type: "CLEAR_CONSULTATION",
});

export const confirmBookingSuccess = (booking) => ({
  type: "CONFIRM_BOOKING_SUCCESS",
  payload: booking,
});

export const confirmBookingFailure = (error) => ({
  type: "CONFIRM_BOOKING_FAILURE",
  payload: error,
});

// Invoice Processing Actions
export const fetchInvoiceRequest = () => ({
  type: "FETCH_INVOICE_REQUEST",
});

export const fetchInvoiceSuccess = (invoice) => ({
  type: "FETCH_INVOICE_SUCCESS",
  payload: invoice,
});

export const fetchInvoiceFailure = (error) => ({
  type: "FETCH_INVOICE_FAILURE",
  payload: error,
});

// Payment Status Polling Actions
export const startPaymentPolling = (transactionId) => ({
  type: "START_PAYMENT_POLLING",
  payload: transactionId,
});

export const stopPaymentPolling = () => ({
  type: "STOP_PAYMENT_POLLING",
});

export const updatePaymentStatus = (status) => ({
  type: "UPDATE_PAYMENT_STATUS",
  payload: status,
});
