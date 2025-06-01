// === YACHT REDUCER ===
const yachtInitialState = {
  currentYacht: null,
  loading: false,
  error: null,
};

const yachtReducer = (state = yachtInitialState, action) => {
  switch (action.type) {
    case "FETCH_YACHT_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_YACHT_SUCCESS":
      return { ...state, loading: false, currentYacht: action.payload };
    case "FETCH_YACHT_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "CLEAR_YACHT":
      return { ...state, currentYacht: null };
    default:
      return state;
  }
};

//=== SERVICES REDUCER ===
const servicesInitialState = {
  data: [],
  loading: false,
  error: null,
};

const servicerReducer = (state = servicesInitialState, action) => {
  switch (action.type) {
    case "FETCH_SERVICES_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_SERVICES_SUCCESS":
      return { ...state, data: action.payload, loading: false };
    case "FETCH_SERVICES_FAILURE":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};
// === IMAGE REDUCER ===
const imageInitialState = {
  images: [{ src: "./images/yacht-8.jpg", alt: "Default Yacht Image" }],
  currentIndex: 0,
  isHovering: false,
  loading: false,
  error: null,
};

const imageReducer = (state = imageInitialState, action) => {
  switch (action.type) {
    case "FETCH_IMAGES_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_IMAGES_SUCCESS":
      return {
        ...state,
        loading: false,
        images: action.payload,
        currentIndex: 0,
      };
    case "FETCH_IMAGES_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "SET_CURRENT_IMAGE_INDEX":
      return { ...state, currentIndex: action.payload };
    case "NEXT_SLIDE":
      return {
        ...state,
        currentIndex:
          state.currentIndex === state.images.length - 1
            ? 0
            : state.currentIndex + 1,
      };
    case "PREV_SLIDE":
      return {
        ...state,
        currentIndex:
          state.currentIndex === 0
            ? state.images.length - 1
            : state.currentIndex - 1,
      };
    case "SET_IMAGE_HOVERING":
      return { ...state, isHovering: action.payload };
    default:
      return state;
  }
};

// === UI REDUCER ===
const uiInitialState = {
  activeTab: 0,
  modals: {
    showRoomModal: false,
    showBookingModal: false,
    showConfirmationModal: false, // THÊM MỚI
    showTransactionModal: false, // THÊM MỚI
    showInvoiceModal: false, // THÊM MỚI
    selectedRoomForModal: null,
    confirmationData: null, // THÊM MỚI
    invoiceData: null, // THÊM MỚI
  },
  activePaymentTab: 0,
  windows: {
    showRegulationsWindow: false,
    showFaqWindow: false,
  },
};

const uiReducer = (state = uiInitialState, action) => {
  switch (action.type) {
    // === EXISTING CASES (giữ nguyên) ===
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };

    case "OPEN_ROOM_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          showRoomModal: true,
          selectedRoomForModal: action.payload,
        },
      };

    case "CLOSE_ROOM_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          showRoomModal: false,
          selectedRoomForModal: null,
        },
      };

    case "OPEN_BOOKING_MODAL":
      return { ...state, modals: { ...state.modals, showBookingModal: true } };

    case "CLOSE_BOOKING_MODAL":
      return { ...state, modals: { ...state.modals, showBookingModal: false } };

    // === NEW MODAL CASES (THÊM MỚI) ===
    case "OPEN_CONFIRMATION_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          showConfirmationModal: true,
          confirmationData: action.payload,
        },
      };

    case "CLOSE_CONFIRMATION_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          showConfirmationModal: false,
          confirmationData: null,
        },
      };

    case "SET_CONFIRMATION_DATA":
      return {
        ...state,
        modals: {
          ...state.modals,
          confirmationData: action.payload,
        },
      };

    case "OPEN_TRANSACTION_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          showTransactionModal: true,
          showConfirmationModal: false,
        },
        activePaymentTab: 0,
        currentBookingId: action.payload?.bookingId || action.payload,
      };

    case "CLOSE_TRANSACTION_MODAL":
      return {
        ...state,
        modals: { ...state.modals, showTransactionModal: false },
        activePaymentTab: 0,
      };

    case "SET_ACTIVE_PAYMENT_TAB":
      return { ...state, activePaymentTab: action.payload };

    case "OPEN_INVOICE_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          showInvoiceModal: true,
          invoiceData: action.payload,
        },
      };

    case "CLOSE_INVOICE_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          showInvoiceModal: false,
          invoiceData: null,
        },
      };

    // === EXISTING WINDOW CASES (giữ nguyên) ===
    case "OPEN_REGULATIONS_WINDOW":
      return {
        ...state,
        windows: { ...state.windows, showRegulationsWindow: true },
      };

    case "CLOSE_REGULATIONS_WINDOW":
      return {
        ...state,
        windows: { ...state.windows, showRegulationsWindow: false },
      };

    case "OPEN_FAQ_WINDOW":
      return { ...state, windows: { ...state.windows, showFaqWindow: true } };

    case "CLOSE_FAQ_WINDOW":
      return { ...state, windows: { ...state.windows, showFaqWindow: false } };

    default:
      return state;
  }
};

// === BOOKING REDUCER ===

const bookingInitialState = {
  bookingId: null,
  rooms: [],
  schedules: [],
  selectedSchedule: "",
  selectedMaxPeople: "all",
  maxPeopleOptions: [],
  bookingForm: {
    checkInDate: "01/06/2025",
    guestCount: "1 Người lớn - 1 - Trẻ em",
    fullName: "",
    phoneNumber: "",
    email: "",
    requirements: "",
  },
  guestCounter: {
    adults: 1,
    children: 1,
    isOpen: false,
  },
  bookingErrors: {},
  totalPrice: 0,
  submitting: false,
  loading: false,
  error: null,

  // Thêm customer bookings state
  customerBookings: [],
  customerBookingsLoading: false,
  customerBookingsError: null,

  // Thêm booking detail state
  currentBookingDetail: null,
  bookingDetailLoading: false,
  bookingDetailError: null,

  consultation: {
    loading: false,
    error: null,
    success: false,
  },
};

const bookingReducer = (state = bookingInitialState, action) => {
  switch (action.type) {
    case "FETCH_ROOMS_REQUEST":
      return { ...state, loading: true, error: null };

    case "FETCH_ROOMS_SUCCESS": {
      const { rooms, schedules } = action.payload;
      const processedRooms = rooms.map((room) => ({
        ...room,
        id: room.id || room._id,
        quantity: 0,
        beds: room.max_people,
        image: room.avatar,
        price: room.price || 0,
        area: room.area || "33",
        description: room.description || "Phòng thoải mái với view đẹp",
      }));

      const processedSchedules = schedules.map((ys) => {
        const start = new Date(ys.scheduleId.startDate);
        const end = new Date(ys.scheduleId.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return {
          _id: ys.scheduleId._id,
          startDate: ys.scheduleId.startDate,
          endDate: ys.scheduleId.endDate,
          durationText: `${days} ngày ${days - 1} đêm`,
        };
      });

      const maxPeopleOptions = [
        ...new Set(processedRooms.map((r) => r.beds)),
      ].sort((a, b) => a - b);

      return {
        ...state,
        loading: false,
        rooms: processedRooms,
        schedules: processedSchedules,
        maxPeopleOptions,
      };
    }
    case "SET_CURRENT_BOOKING_ID":
      return { ...state, currentBookingId: action.payload };

    case "FETCH_ROOMS_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "INCREMENT_ROOM_QUANTITY": {
      const updatedRoomsInc = state.rooms.map((room) =>
        room.id === action.payload
          ? { ...room, quantity: (room.quantity || 0) + 1 }
          : room
      );
      return {
        ...state,
        rooms: updatedRoomsInc,
        totalPrice: updatedRoomsInc.reduce(
          (sum, r) => sum + r.price * r.quantity,
          0
        ),
      };
    }

    case "DECREMENT_ROOM_QUANTITY": {
      const roomToDec = state.rooms.find((r) => r.id === action.payload);
      if (roomToDec && roomToDec.quantity > 0) {
        const updatedRoomsDec = state.rooms.map((room) =>
          room.id === action.payload
            ? { ...room, quantity: room.quantity - 1 }
            : room
        );
        return {
          ...state,
          rooms: updatedRoomsDec,
          totalPrice: updatedRoomsDec.reduce(
            (sum, r) => sum + r.price * r.quantity,
            0
          ),
        };
      }
      return state;
    }

    case "SET_SELECTED_SCHEDULE":
      return { ...state, selectedSchedule: action.payload };

    case "SET_SELECTED_MAX_PEOPLE":
      return { ...state, selectedMaxPeople: action.payload };

    case "UPDATE_BOOKING_FORM": {
      const { field, value } = action.payload;
      const newBookingForm = { ...state.bookingForm, [field]: value };
      const newBookingErrors = { ...state.bookingErrors };
      if (newBookingErrors[field]) delete newBookingErrors[field];
      return {
        ...state,
        bookingForm: newBookingForm,
        bookingErrors: newBookingErrors,
      };
    }

    case "SET_GUEST_COUNTER_OPEN":
      return {
        ...state,
        guestCounter: { ...state.guestCounter, isOpen: action.payload },
      };

    case "UPDATE_ADULTS": {
      const newAdults = Math.max(1, state.guestCounter.adults + action.payload);
      const guestText = `${newAdults} Người lớn - ${state.guestCounter.children} - Trẻ em`;
      return {
        ...state,
        guestCounter: { ...state.guestCounter, adults: newAdults },
        bookingForm: { ...state.bookingForm, guestCount: guestText },
      };
    }

    case "UPDATE_CHILDREN": {
      const newChildren = Math.max(
        0,
        state.guestCounter.children + action.payload
      );
      const guestTextChildren = `${state.guestCounter.adults} Người lớn - ${newChildren} - Trẻ em`;
      return {
        ...state,
        guestCounter: { ...state.guestCounter, children: newChildren },
        bookingForm: { ...state.bookingForm, guestCount: guestTextChildren },
      };
    }

    case "CLEAR_SELECTION":
      return {
        ...state,
        rooms: state.rooms.map((room) => ({ ...room, quantity: 0 })),
        totalPrice: 0,
      };

    case "RESET_FORMS":
      return {
        ...state,
        bookingForm: {
          checkInDate: "25/05/2025",
          guestCount: "3 Người lớn - 1 - Trẻ em",
          fullName: "",
          phoneNumber: "",
          email: "",
          requirements: "",
        },
        bookingErrors: {},
      };

    case "SET_BOOKING_ERRORS":
      return { ...state, bookingErrors: action.payload };

    case "SET_FORM_VALIDATION": {
      const { field, isValid, errorMessage } = action.payload;
      return {
        ...state,
        bookingErrors: {
          ...state.bookingErrors,
          [field]: isValid ? undefined : errorMessage,
        },
      };
    }
    case "SET_BOOKING_ID":
      return { ...state, bookingId: action.payload };
    case "CLEAR_ALL_ERRORS":
      return {
        ...state,
        bookingErrors: {},
      };

    case "SET_SUBMITTING":
      return { ...state, submitting: action.payload };

    // Customer bookings cases
    case "FETCH_CUSTOMER_BOOKINGS_REQUEST":
      return {
        ...state,
        customerBookingsLoading: true,
        customerBookingsError: null,
      };

    case "FETCH_CUSTOMER_BOOKINGS_SUCCESS":
      return {
        ...state,
        customerBookingsLoading: false,
        customerBookings: action.payload,
        customerBookingsError: null,
      };

    case "FETCH_CUSTOMER_BOOKINGS_FAILURE":
      return {
        ...state,
        customerBookingsLoading: false,
        customerBookingsError: action.payload,
      };

    // Booking detail cases
    case "FETCH_BOOKING_DETAIL_REQUEST":
      return {
        ...state,
        bookingDetailLoading: true,
        bookingDetailError: null,
      };

    case "FETCH_BOOKING_DETAIL_SUCCESS":
      return {
        ...state,
        bookingDetailLoading: false,
        currentBookingDetail: action.payload,
        bookingDetailError: null,
      };

    case "FETCH_BOOKING_DETAIL_FAILURE":
      return {
        ...state,
        bookingDetailLoading: false,
        bookingDetailError: action.payload,
      };
    case "REQUEST_CONSULTATION_REQUEST":
      return {
        ...state,
        consultation: {
          ...state.consultation,
          loading: true,
          error: null,
          success: false,
        },
      };

    case "REQUEST_CONSULTATION_SUCCESS":
      return {
        ...state,
        consultation: {
          ...state.consultation,
          loading: false,
          success: true,
          error: null,
        },
      };

    case "REQUEST_CONSULTATION_FAILURE":
      return {
        ...state,
        consultation: {
          ...state.consultation,
          loading: false,
          error: action.payload,
          success: false,
        },
      };
    default:
      return state;
  }
};

// === REVIEWS REDUCER ===
const reviewsInitialState = {
  reviews: [],
  ratingData: {
    total: 0,
    average: 0,
    distribution: [],
  },
  currentPage: 1,
  totalPages: 1,
  searchTerm: "",
  loading: false,
  error: null,
};

const reviewsReducer = (state = reviewsInitialState, action) => {
  switch (action.type) {
    case "FETCH_REVIEWS_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_REVIEWS_SUCCESS":
      console.log("Reducer - FETCH_REVIEWS_SUCCESS payload:", action.payload); // Debug
      return {
        ...state,
        loading: false,
        reviews: action.payload.reviews || [], // Đảm bảo reviews luôn là array
        ratingData: action.payload.ratingData || state.ratingData,
        currentPage: action.payload.currentPage || 1,
        totalPages: action.payload.totalPages || 1,
      };
    case "FETCH_REVIEWS_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
        reviews: [], // Reset reviews khi có lỗi
      };
    case "SET_REVIEW_SEARCH_TERM":
      return { ...state, searchTerm: action.payload, currentPage: 1 };
    case "SET_REVIEW_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SUBMIT_REVIEW_SUCCESS":
      // Khi submit review thành công, có thể cần refresh lại danh sách
      return { ...state };
    default:
      return state;
  }
};

const reviewFormInitialState = {
  userRating: 0,
  description: "",
  isSubmitting: false,
  error: null,
};

const reviewFormReducer = (state = reviewFormInitialState, action) => {
  switch (action.type) {
    case "SET_USER_RATING":
      return { ...state, userRating: action.payload };
    case "SET_REVIEW_DESCRIPTION":
      return { ...state, description: action.payload };
    case "SUBMIT_REVIEW_REQUEST":
      return {
        ...state,
        isSubmitting: true,
        error: null,
      };
    case "SUBMIT_REVIEW_SUCCESS":
      return {
        ...state,
        isSubmitting: false,
        error: null,
        // Không reset form ở đây, để component tự reset
      };
    case "SUBMIT_REVIEW_FAILURE":
      return {
        ...state,
        isSubmitting: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
const authInitialState = {
  isAuthenticated: false,
  customer: null,
  customerId: null, // Thêm field này
};

const authReducer = (state = authInitialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
    case "SET_AUTHENTICATED":
      return {
        ...state,
        isAuthenticated: true,
        customer: action.payload,
        customerId:
          action.payload.customerId ||
          action.payload.id ||
          action.payload._id ||
          null,
      };
    case "SET_CUSTOMER_ID":
      return {
        ...state,
        customerId: action.payload,
      };
    case "CHECK_AUTH_STATUS":
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("customer");
      if (token && user) {
        try {
          const parsedUser = JSON.parse(user);
          return {
            ...state,
            isAuthenticated: true,
            customer: parsedUser,
            customerId:
              parsedUser.customerId || parsedUser.id || parsedUser._id || null,
          };
        } catch (error) {
          return state;
        }
      }
      return state;
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("customer");
      return {
        ...state,
        isAuthenticated: false,
        customer: null,
        customerId: null,
      };
    default:
      return state;
  }
};

// === FILTERS REDUCER ===
const filtersInitialState = {
  searchTerm: "Tất cả du thuyền",
  selectedDeparturePoint: "Tất cả địa điểm",
  selectedPriceRange: "Tất cả mức giá",
  currentPage: 1,
  sortOption: "",
  selectedStars: [],
  selectedDurations: [],
  selectedServices: [],
  serviceShowCount: 5,
  noResults: false,
  filteredYachts: [],
  loading: false,
  error: null,
};

const filtersReducer = (state = filtersInitialState, action) => {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload, currentPage: 1 };
    case "SET_STAR_FILTER":
      return {
        ...state,
        currentPage: 1,
        selectedStars: state.selectedStars.includes(action.payload)
          ? state.selectedStars.filter((star) => star !== action.payload)
          : [...state.selectedStars, action.payload],
      };
    case "SET_DURATION_FILTER":
      return {
        ...state,
        currentPage: 1,
        selectedDurations: state.selectedDurations.includes(action.payload)
          ? state.selectedDurations.filter(
              (duration) => duration !== action.payload
            )
          : [...state.selectedDurations, action.payload],
      };
    case "SET_SERVICE_FILTER":
      return {
        ...state,
        currentPage: 1,
        selectedServices: state.selectedServices.includes(action.payload)
          ? state.selectedServices.filter(
              (service) => service !== action.payload
            )
          : [...state.selectedServices, action.payload],
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
    case "SET_SERVICE_SHOW_COUNT":
      return { ...state, serviceShowCount: action.payload };
    case "SET_NO_RESULTS":
      return { ...state, noResults: action.payload };
    case "SET_FILTERED_YACHTS":
      return { ...state, filteredYachts: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_SELECTED_STARS":
      return { ...state, selectedStars: action.payload };
    case "SET_SELECTED_DURATIONS":
      return { ...state, selectedDurations: action.payload };
    case "SET_SELECTED_SERVICES":
      return { ...state, selectedServices: action.payload };
    default:
      return state;
  }
};
// === PAYMENT REDUCER (MỚI) ===
const paymentInitialState = {
  currentTransaction: null,
  qrCodeData: null,
  paymentStatus: "idle", // 'idle' | 'pending' | 'completed' | 'failed'
  isPolling: false,
  pollingTransactionId: null,
  loading: false,
  error: null,
};

const paymentReducer = (state = paymentInitialState, action) => {
  switch (action.type) {
    case "CREATE_TRANSACTION_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
        paymentStatus: "pending",
      };

    case "CREATE_TRANSACTION_SUCCESS":
      return {
        ...state,
        loading: false,
        currentTransaction: action.payload.transaction,
        error: null,
      };

    case "CREATE_TRANSACTION_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
        paymentStatus: "failed",
      };

    case "SET_QR_CODE_DATA":
      return {
        ...state,
        qrCodeData: action.payload,
      };

    case "CLEAR_QR_CODE_DATA":
      return {
        ...state,
        qrCodeData: null,
        currentTransaction: null,
        paymentStatus: "idle",
      };

    case "START_PAYMENT_POLLING":
      return {
        ...state,
        isPolling: true,
        pollingTransactionId: action.payload,
      };

    case "STOP_PAYMENT_POLLING":
      return {
        ...state,
        isPolling: false,
        pollingTransactionId: null,
      };

    case "UPDATE_PAYMENT_STATUS":
      return {
        ...state,
        paymentStatus: action.payload,
      };

    default:
      return state;
  }
};

// === INVOICE REDUCER (MỚI) ===
const invoiceInitialState = {
  currentInvoice: null,
  loading: false,
  error: null,
};

const invoiceReducer = (state = invoiceInitialState, action) => {
  switch (action.type) {
    case "FETCH_INVOICE_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "FETCH_INVOICE_SUCCESS":
      return {
        ...state,
        loading: false,
        currentInvoice: action.payload,
        error: null,
      };

    case "FETCH_INVOICE_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

// === COMBINE REDUCERS ===
export {
  yachtReducer,
  imageReducer,
  uiReducer,
  bookingReducer,
  reviewsReducer,
  filtersReducer,
  reviewFormReducer,
  authReducer,
  servicerReducer,
  paymentReducer,
  invoiceReducer,
};

export default filtersReducer;
