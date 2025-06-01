import axios from "axios";
import Swal from "sweetalert2";
import {
  fetchYachtRequest,
  fetchYachtSuccess,
  fetchYachtFailure,
  fetchImagesRequest,
  fetchImagesSuccess,
  fetchImagesFailure,
  fetchRoomsRequest,
  fetchRoomsSuccess,
  fetchRoomsFailure,
  fetchReviewsRequest,
  fetchReviewsSuccess,
  fetchReviewsFailure,
  submitReviewRequest,
  submitReviewSuccess,
  submitReviewFailure,
  requestConsultationRequest,
  requestConsultationSuccess,
  requestConsultationFailure,
  setSubmitting,
  setAuthenticated,
  closeBookingModal,
  openTransactionModal,
  confirmBookingRequest,
  confirmBookingSuccess,
  closeConfirmationModal,
  confirmBookingFailure,
  updateBookingStatus,
  createTransactionRequest,
  createTransactionSuccess,
  setQRCodeData,
  createTransactionFailure,
  startPaymentPolling,
  updatePaymentStatus,
  stopPaymentPolling,
  fetchInvoiceRequest,
  fetchInvoiceSuccess,
  clearQRCodeData,
  closeTransactionModal,
  openInvoiceModal,
  fetchInvoiceFailure,
} from "./action";
import { formatPrice } from "./validation";

// === YACHT ASYNC ACTIONS ===
export const fetchYachtById = (yachtId) => async (dispatch) => {
  dispatch(fetchYachtRequest());
  try {
    const [yachtResponse, servicesResponse] = await Promise.all([
      axios.get(`http://localhost:9999/api/v1/yachts/findboat/${yachtId}`),
      axios.get(`http://localhost:9999/api/v1/yachts/${yachtId}/services`),
    ]);
    const yachtData = {
      ...yachtResponse.data.data,
      services: Array.isArray(servicesResponse.data?.data)
        ? servicesResponse.data.data
        : [],
    };
    dispatch(fetchYachtSuccess(yachtData));
  } catch (error) {
    dispatch(fetchYachtFailure(error.message));
  }
};

//=== SERVICE ASYNC ACTIONS ===
export const fetchServices = (yachtId) => async (dispatch) => {
  try {
    dispatch({ type: "FETCH_SERVICES_REQUEST" });
    const response = await axios.get(
      `http://localhost:9999/api/v1/yachts/${yachtId}/services`
    );
    console.log("fetchServices response:", response.data); // Debug log
    const servicesData = Array.isArray(response.data?.data)
      ? response.data.data
      : [];
    console.log("Processed services data:", servicesData); // Debug log
    dispatch({ type: "FETCH_SERVICES_SUCCESS", payload: servicesData });
  } catch (error) {
    console.error("fetchServices error:", error); // Debug log
    dispatch({ type: "FETCH_SERVICES_FAILURE", payload: error.message });
  }
};

// === IMAGE ASYNC ACTIONS ===
export const fetchYachtImages = (yachtId) => async (dispatch) => {
  dispatch(fetchImagesRequest());
  try {
    const response = await axios.get(
      `http://localhost:9999/api/v1/yachtImages/yacht/${yachtId}`
    );
    const images = response.data.data || [];
    const processedImages =
      images.length > 0
        ? images.map((url, idx) => ({
            src: url,
            alt: `Yacht image ${idx + 1}`,
          }))
        : [{ src: "./images/yacht-8.jpg", alt: "Default Image" }];
    dispatch(fetchImagesSuccess(processedImages));
  } catch (error) {
    dispatch(fetchImagesFailure(error.message));
    dispatch(
      fetchImagesSuccess([
        { src: "./images/yacht-8.jpg", alt: "Default Image" },
      ])
    );
  }
};

// === BOOKING ASYNC ACTIONS ===
export const fetchRoomsAndSchedules =
  (yachtId, scheduleId) => async (dispatch) => {
    dispatch(fetchRoomsRequest());
    try {
      const [roomsResponse, schedulesResponse] = await Promise.all([
        axios.get("http://localhost:9999/api/v1/rooms", {
          params: { yachtId, scheduleId },
        }),
        axios.get(`http://localhost:9999/api/v1/yachts/${yachtId}/schedules`),
      ]);
      dispatch(
        fetchRoomsSuccess(
          roomsResponse.data.data.rooms,
          schedulesResponse.data.data
        )
      );
    } catch (error) {
      dispatch(fetchRoomsFailure(error.message));
    }
  };

//=== CONSULTATION ASYNC ACTIONS ===
export const submitRoomBooking =
  (bookingData) => async (dispatch, getState) => {
    dispatch(setSubmitting(true));
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực.");
      }

      const state = getState();
      const { selectedSchedule } = state.booking;

      const requestData = {
        checkInDate: bookingData.checkInDate,
        selectedRooms: bookingData.selectedRooms.map((room) => ({
          id: room.id || room._id,
          name: room.name,
          quantity: room.quantity,
          price: room.price,
        })),
        totalPrice: bookingData.totalPrice,
        yachtId: bookingData.yachtId,
        scheduleId: selectedSchedule || null,
        fullName: bookingData.fullName,
        phoneNumber: bookingData.phoneNumber,
        email: bookingData.email,
        requirements: bookingData.requirements || "",
        guestCount: bookingData.guestCount,
        status: "consultation_requested",
      };

      console.log("Sending booking data to server:", requestData);

      const response = await axios.post(
        "http://localhost:9999/api/v1/bookings/rooms",
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Booking response:", response.data);

      if (response.data.success) {
        dispatch(setSubmitting(false));
        const bookingId = response.data.data.bookingId;
        console.log("Received bookingId:", bookingId);
        if (!bookingId) {
          throw new Error("Không nhận được bookingId từ server.");
        }
        // Dispatch action để lưu bookingId vào Redux state (nếu cần)
        dispatch({ type: "SET_BOOKING_ID", payload: bookingId });
        return {
          success: true,
          data: {
            bookingId,
            ...response.data.data,
          },
        };
      } else {
        throw new Error(response.data.message || "Tạo booking thất bại.");
      }
    } catch (error) {
      dispatch(setSubmitting(false));
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Tạo booking thất bại.";
      console.error("Booking error:", errorMessage);
      Swal.fire({
        icon: "error",
        title: "Lỗi tạo booking!",
        text: errorMessage,
        confirmButtonText: "Thử lại",
      });
      return { success: false, error: errorMessage };
    }
  };

// Trong confirmBooking action
export const confirmBooking = (data) => async (dispatch) => {
  const { bookingId, scheduleId } = data;
  dispatch(setSubmitting(true));
  dispatch(confirmBookingRequest());

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token xác thực.");
    }

    console.log("Confirming booking with data:", { bookingId, scheduleId });

    const response = await axios.patch(
      `http://localhost:9999/api/v1/bookings/${bookingId}/confirm`,
      { scheduleId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      dispatch(confirmBookingSuccess(response.data.data));
      dispatch(setSubmitting(false));

      // ✅ Fetch booking detail trước khi mở transaction modal
      const bookingDetailResult = await dispatch(fetchBookingDetail(bookingId));

      if (bookingDetailResult.success) {
        dispatch(closeConfirmationModal());
        dispatch(openTransactionModal(bookingId));

        return { success: true, data: response.data.data };
      } else {
        throw new Error("Không thể lấy thông tin booking detail");
      }
    }
  } catch (error) {
    dispatch(setSubmitting(false));
    dispatch(confirmBookingFailure(error.message));
    return { success: false, error: error.message };
  }
};

// Reject booking action
export const rejectBooking = (bookingId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `http://localhost:9999/api/v1/bookings/${bookingId}/reject`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      dispatch(updateBookingStatus(bookingId, "cancelled"));
      dispatch(closeConfirmationModal());

      Swal.fire({
        icon: "info",
        title: "Đã hủy booking",
        text: "Booking đã được hủy thành công.",
      });

      return { success: true };
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Lỗi hủy booking!",
      text: error.response?.data?.message || error.message,
    });
    return { success: false, error: error.message };
  }
};

// Create deposit payment (20%)
// asyncActions.js - Cải thiện error handling
export const createDepositPayment = (bookingId) => async (dispatch) => {
  dispatch(createTransactionRequest());
  try {
    const token = localStorage.getItem("token");
    console.log("Calling deposit API with bookingId:", bookingId);

    const response = await axios.post(
      "http://localhost:9999/api/v1/payments/deposit",
      { bookingId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("✅ Deposit API response:", response.data);

    if (response.data.success) {
      dispatch(createTransactionSuccess(response.data.data));
      dispatch(setQRCodeData(response.data.data));
      console.log("QR data set to Redux:", response.data.data);

      // Start polling payment status
      dispatch(startPaymentStatusPolling(response.data.data.transaction._id));
      return { success: true, data: response.data.data };
    }
  } catch (error) {
    console.error("❌ Deposit payment error:", error);
    console.error("❌ Error response:", error.response?.data); // ✅ Thêm log chi tiết

    const errorMessage = error.response?.data?.message || error.message;
    dispatch(createTransactionFailure(errorMessage));

    // ✅ Hiển thị lỗi chi tiết hơn
    Swal.fire({
      icon: "error",
      title: "Lỗi tạo thanh toán!",
      text: errorMessage,
      footer: error.response?.data?.error
        ? `Chi tiết: ${error.response.data.error}`
        : "",
    });

    return { success: false, error: errorMessage };
  }
};

// Create full payment (100%)
export const createFullPayment = (bookingId) => async (dispatch) => {
  dispatch(createTransactionRequest());
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:9999/api/v1/payments/full",
      { bookingId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      dispatch(createTransactionSuccess(response.data.data));
      dispatch(setQRCodeData(response.data.data));

      // Start polling payment status
      dispatch(startPaymentStatusPolling(response.data.data.transaction._id));

      return { success: true, data: response.data.data };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(createTransactionFailure(errorMessage));
    Swal.fire({
      icon: "error",
      title: "Lỗi tạo thanh toán!",
      text: errorMessage,
    });
    return { success: false, error: errorMessage };
  }
};

// Poll payment status
let pollingInterval = null;

export const startPaymentStatusPolling =
  (transactionId) => async (dispatch) => {
    dispatch(startPaymentPolling(transactionId));

    pollingInterval = setInterval(async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:9999/api/v1/payments/transaction/${transactionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const transaction = response.data.data;
        dispatch(updatePaymentStatus(transaction.status));

        if (transaction.status === "completed") {
          dispatch(stopPaymentStatusPolling());
          dispatch(handlePaymentSuccess(transactionId));
        } else if (transaction.status === "failed") {
          dispatch(stopPaymentStatusPolling());
          Swal.fire({
            icon: "error",
            title: "Thanh toán thất bại!",
            text: "Giao dịch không thành công. Vui lòng thử lại.",
          });
        }
      } catch (error) {
        console.error("Error polling payment status:", error);
      }
    }, 3000); // Poll every 3 seconds
  };

export const stopPaymentStatusPolling = () => (dispatch) => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
  dispatch(stopPaymentPolling());
};

// Handle payment success
export const handlePaymentSuccess = (transactionId) => async (dispatch) => {
  dispatch(fetchInvoiceRequest());
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:9999/api/v1/invoices/transaction/${transactionId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      dispatch(fetchInvoiceSuccess(response.data.data));
      dispatch(clearQRCodeData());
      dispatch(closeTransactionModal());
      dispatch(openInvoiceModal(response.data.data));

      Swal.fire({
        icon: "success",
        title: "Thanh toán thành công!",
        text: "Hóa đơn đã được tạo. Cảm ơn bạn đã sử dụng dịch vụ!",
        timer: 3000,
      });
    }
  } catch (error) {
    dispatch(fetchInvoiceFailure(error.message));
    console.error("Error fetching invoice:", error);
  }
};

// Download invoice PDF
export const downloadInvoicePDF = (invoiceId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:9999/api/v1/invoices/${invoiceId}/pdf`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );

    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice-${invoiceId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    Swal.fire({
      icon: "success",
      title: "Tải xuống thành công!",
      text: "Hóa đơn đã được tải xuống.",
      timer: 2000,
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Lỗi tải xuống!",
      text: "Không thể tải xuống hóa đơn. Vui lòng thử lại.",
    });
  }
};

// Simulate payment for testing
export const simulatePaymentSuccess = (transactionId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(
      `http://localhost:9999/api/v1/payments/simulate/${transactionId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Payment simulation successful, polling will handle the rest
    Swal.fire({
      icon: "info",
      title: "Mô phỏng thanh toán",
      text: "Đang xử lý thanh toán...",
      timer: 2000,
    });
  } catch (error) {
    console.error("Error simulating payment:", error);
  }
};

// Cập nhật endpoint trong requestConsultation
export const requestConsultation = (consultationData) => async (dispatch) => {
  dispatch(requestConsultationRequest());
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token xác thực.");
    }

    const response = await axios.post(
      "http://localhost:9999/api/v1/bookings/consultation", // Đổi từ consultation thành bookings/consultation
      consultationData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.success) {
      dispatch(requestConsultationSuccess());
      return { success: true, data: response.data };
    } else {
      throw new Error(response.data.message || "Yêu cầu tư vấn thất bại.");
    }
  } catch (error) {
    dispatch(requestConsultationFailure(error.message));
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Yêu cầu tư vấn thất bại.";

    Swal.fire({
      icon: "error",
      title: "Lỗi!",
      text: errorMessage,
      confirmButtonText: "OK",
    });

    return { success: false, error: errorMessage };
  }
};

// Thêm actions mới cho customer bookings
export const fetchCustomerBookings = () => async (dispatch) => {
  dispatch({ type: "FETCH_CUSTOMER_BOOKINGS_REQUEST" });
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token xác thực.");
    }

    const response = await axios.get(
      "http://localhost:9999/api/v1/bookings/my-bookings",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.success) {
      dispatch({
        type: "FETCH_CUSTOMER_BOOKINGS_SUCCESS",
        payload: response.data.data,
      });
      return { success: true, data: response.data.data };
    } else {
      throw new Error(response.data.message || "Lỗi lấy danh sách booking");
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({
      type: "FETCH_CUSTOMER_BOOKINGS_FAILURE",
      payload: errorMessage,
    });
    return { success: false, error: errorMessage };
  }
};

export const fetchBookingDetail = (bookingId) => async (dispatch) => {
  dispatch({ type: "FETCH_BOOKING_DETAIL_REQUEST" });
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token xác thực.");
    }

    const response = await axios.get(
      `http://localhost:9999/api/v1/bookings/${bookingId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.success) {
      dispatch({
        type: "FETCH_BOOKING_DETAIL_SUCCESS",
        payload: response.data.data,
      });
      return { success: true, data: response.data.data };
    } else {
      throw new Error(response.data.message || "Lỗi lấy chi tiết booking");
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({
      type: "FETCH_BOOKING_DETAIL_FAILURE",
      payload: errorMessage,
    });
    return { success: false, error: errorMessage };
  }
};

// === REVIEW ASYNC ACTIONS ===
export const fetchReviews =
  (yachtId, page = 1, search = "") =>
  async (dispatch) => {
    dispatch(fetchReviewsRequest());
    try {
      const response = await axios.get(
        "http://localhost:9999/api/v1/feedback",
        {
          params: { yachtId, page, limit: 5, search },
        }
      );
      const apiData = response.data.data || response.data;
      const reviews = apiData.reviews || [];
      const processedData = {
        reviews: reviews.map((review) => {
          // Xử lý date với support cho DD/MM/YYYY format
          let formattedDate = "N/A";
          const dateFields = ["createdAt", "created_at", "date", "reviewDate"];
          for (const field of dateFields) {
            if (review[field]) {
              try {
                let dateValue = review[field];
                // Xử lý MongoDB date structure
                if (typeof dateValue === "object" && dateValue.$date) {
                  dateValue = dateValue.$date;
                }
                if (typeof dateValue === "string") {
                  // Kiểm tra nếu đã là format DD/MM/YYYY
                  const ddmmyyyyPattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
                  const ddmmyyyyMatch = dateValue.match(ddmmyyyyPattern);
                  if (ddmmyyyyMatch) {
                    // Nếu đã là DD/MM/YYYY, dùng trực tiếp
                    formattedDate = dateValue;
                    break;
                  } else {
                    // Thử parse ISO format hoặc các format khác
                    const date = new Date(dateValue);
                    if (!isNaN(date.getTime())) {
                      formattedDate = date.toLocaleDateString("vi-VN");
                      break;
                    }
                  }
                } else {
                  // Number timestamp hoặc Date object
                  const date = new Date(dateValue);
                  if (!isNaN(date.getTime())) {
                    formattedDate = date.toLocaleDateString("vi-VN");
                    break;
                  }
                }
              } catch (error) {
                console.error(`Date parsing error for field ${field}:`, error);
              }
            }
          }
          // Thử nhiều cách để lấy userName
          let userName = "Khách ẩn danh";
          if (review.customerId?.fullName) {
            userName = review.customerId.fullName;
          } else if (review.customerName) {
            userName = review.customerName;
          } else if (review.customer?.fullName) {
            userName = review.customer.fullName;
          } else if (review.user?.name) {
            userName = review.user.name;
          } else if (review.userName) {
            userName = review.userName;
          } else if (review.name) {
            userName = review.name;
          }
          return {
            id:
              review.id ||
              review._id?.$oid ||
              review._id ||
              Math.random().toString(36),
            userName: userName,
            rating: review.starRating || review.rating || 0,
            comment: review.description || review.comment || review.text || "",
            date: formattedDate,
            tag:
              review.customerId?.tag ||
              review.customer?.tag ||
              review.tag ||
              null,
          };
        }),
        ratingData: apiData.ratingData || {
          total: 0,
          average: 0,
          distribution: [],
        },
        currentPage: apiData.currentPage || page,
        totalPages: apiData.totalPages || 1,
        total: apiData.total || reviews.length,
      };
      dispatch(fetchReviewsSuccess(processedData));
    } catch (error) {
      dispatch(fetchReviewsFailure(error.message));
    }
  };

export const submitReview = (reviewData) => async (dispatch) => {
  dispatch(submitReviewRequest());

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      const errorMsg = "Không tìm thấy token xác thực.";
      dispatch(submitReviewFailure(errorMsg));
      return { success: false, message: errorMsg };
    }

    const requestBody = {
      starRating: parseInt(reviewData.starRating),
      description: reviewData.description.trim(),
      yachtId: reviewData.yachtId,
      customerId: reviewData.customerId, // Thêm customerId vào request
    };

    const response = await axios.post(
      "http://localhost:9999/api/v1/feedback",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Kiểm tra response.data.success thay vì response.success
    if (response.data && response.data.success === true) {
      dispatch(submitReviewSuccess());

      // Refresh reviews list
      if (reviewData.yachtId) {
        dispatch(fetchReviews(reviewData.yachtId, 1));
      }

      return {
        success: true,
        message: response.data.message || "Đánh giá đã được gửi thành công",
        data: response.data.data,
      };
    } else {
      const errorMsg = response.data?.message || "Submit failed";
      dispatch(submitReviewFailure(errorMsg));
      return { success: false, message: errorMsg };
    }
  } catch (error) {
    let errorMessage = "Không thể gửi đánh giá, vui lòng thử lại.";

    if (error.response) {
      // Server responded with error status
      errorMessage =
        error.response.data?.message ||
        `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "Không thể kết nối đến server";
    } else {
      // Something else happened
      errorMessage = error.message;
    }

    dispatch(submitReviewFailure(errorMessage));
    return { success: false, message: errorMessage };
  }
};

export const initializeAuth = () => (dispatch) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("customer");
  if (token && user) {
    try {
      const userData = JSON.parse(user);
      dispatch(setAuthenticated(userData));
    } catch (error) {
      // Clear invalid data
      localStorage.removeItem("token");
      localStorage.removeItem("customer");
    }
  }
};

// Thêm vào asyncActions.js
export const fetchCustomerIdFromStorage = () => (dispatch) => {
  try {
    const customerData = localStorage.getItem("customer");
    if (customerData) {
      const parsedCustomer = JSON.parse(customerData);

      // Dispatch customer data vào Redux
      dispatch(setAuthenticated(parsedCustomer));

      console.log("Customer data loaded to Redux:", parsedCustomer);
      return parsedCustomer;
    }
    return null;
  } catch (error) {
    console.error("Error fetching customer from storage:", error);
    return null;
  }
};
