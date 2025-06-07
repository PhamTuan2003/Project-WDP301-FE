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
  genericBookingRequest, // NEW: Action chung cho request
  genericBookingSuccess, // NEW: Action chung cho success
  genericBookingFailure,
  setSubmitting,
  setAuthenticated,
  closeBookingModal,
  openTransactionModal,
  confirmConsultationRequest, // CHANGED
  confirmConsultationSuccess,
  closeConfirmationModal,
  confirmConsultationFailure,
  updateBookingStatusAction,
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
  openConfirmationModal,
  fetchBookingDetailRequest,
  fetchBookingDetailSuccess,
  fetchBookingDetailFailure,
  clearConsultation,
  setEditingBookingId,
  resetBookingForm,
  setInvoiceData,
} from "./action";
import { formatPrice } from "./validation";

// Module-level variable for payment polling interval
let pollingInterval = null;

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

export const updateBookingOrConsultationRequest =
  (bookingId, bookingData, requestType) => async (dispatch, getState) => {
    dispatch(genericBookingRequest());
    dispatch(setSubmitting(true));

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token xác thực.");

      // Lấy scheduleId từ state nếu cần
      const { selectedSchedule } = getState().booking;

      const requestPayload = {
        ...bookingData,
        scheduleId: selectedSchedule || bookingData.scheduleId || null,
        requestType: requestType, // 'consultation_requested' hoặc 'pending_payment'
      };

      const response = await axios.put(
        `http://localhost:9999/api/v1/bookings/request/${bookingId}`,
        requestPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const updatedBookingOrder = response.data.data;
        dispatch(genericBookingSuccess(updatedBookingOrder));
        dispatch(setSubmitting(false));
        dispatch(closeBookingModal());

        if (requestType === "pending_payment") {
          // Mở modal xác nhận thanh toán
          const confirmationModalData = {
            ...bookingData,
            bookingId: updatedBookingOrder.bookingId || updatedBookingOrder._id,
            bookingCode: updatedBookingOrder.bookingCode,
            scheduleId: selectedSchedule || bookingData.scheduleId || null,
            isDirectBooking: true,
            amountToPay:
              updatedBookingOrder.paymentBreakdown?.depositAmount > 0
                ? updatedBookingOrder.paymentBreakdown.depositAmount
                : updatedBookingOrder.amount,
            paymentTypeForConfirmation:
              updatedBookingOrder.paymentBreakdown?.depositAmount > 0
                ? "deposit"
                : "full",
          };
          dispatch(openConfirmationModal(confirmationModalData));
        } else {
          Swal.fire({
            icon: "success",
            title: "Cập nhật yêu cầu tư vấn thành công!",
            text: "Chúng tôi sẽ liên hệ lại với bạn.",
            showConfirmButton: false,
            timer: 2500,
          });
          dispatch(resetBookingForm());
        }

        return { success: true, data: updatedBookingOrder };
      } else {
        throw new Error(response.data.message || "Cập nhật yêu cầu thất bại.");
      }
    } catch (error) {
      dispatch(setSubmitting(false));
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(genericBookingFailure(errorMessage));
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };
/**
 * CUSTOMER ACTION: Create a direct booking (pending_payment) or a consultation request.
 * Calls POST /api/v1/bookings/request
 */

export const createBookingOrConsultationRequest =
  (bookingData, requestType) => async (dispatch, getState) => {
    dispatch(genericBookingRequest());
    dispatch(setSubmitting(true));

    console.log("Starting createBookingOrConsultationRequest with:", {
      requestType,
      bookingData,
    });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực.");
      }

      const { selectedSchedule } = getState().booking;
      console.log("Selected schedule from state:", selectedSchedule);

      // Validate required fields
      const requiredFields = [
        "yachtId",
        "fullName",
        "email",
        "phoneNumber",
        "guestCount",
        "checkInDate",
      ];
      console.log("Validating required fields...");
      const missingFields = requiredFields.filter(
        (field) => !bookingData[field]
      );

      if (missingFields.length > 0) {
        console.warn("Missing required fields:", missingFields);
        throw new Error(
          `Thiếu thông tin bắt buộc: ${missingFields.join(", ")}`
        );
      }

      // Validate rooms
      console.log("Selected rooms:", bookingData.selectedRooms);
      if (
        !bookingData.selectedRooms ||
        bookingData.selectedRooms.length === 0
      ) {
        throw new Error("Vui lòng chọn ít nhất một phòng.");
      }

      // Validate total price for direct booking
      if (
        requestType === "pending_payment" &&
        (!bookingData.totalPrice || bookingData.totalPrice <= 0)
      ) {
        console.warn(
          "Invalid total price for direct booking:",
          bookingData.totalPrice
        );
        throw new Error("Tổng giá phải lớn hơn 0 cho đặt trực tiếp.");
      }

      const requestPayload = {
        ...bookingData,
        selectedRooms: bookingData.selectedRooms.map((room) => ({
          id: room.id || room._id,
          name: room.name,
          quantity: room.quantity,
          price: room.price,
          description: room.description || "",
          area: room.area || 0,
          avatar: room.avatar || "",
          max_people: room.max_people || 1,
          beds: room.beds || 1,
          image: room.image || room.avatar || "",
        })),
        scheduleId: selectedSchedule || bookingData.scheduleId || null,
        requestType: requestType,
      };

      console.log("Sending request with payload:", requestPayload);

      const response = await axios.post(
        "http://localhost:9999/api/v1/bookings/request",
        requestPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Received response:", response.data);

      if (response.data.success) {
        const createdBookingOrder = response.data.data;
        console.log("Created booking order:", createdBookingOrder);

        dispatch(genericBookingSuccess(createdBookingOrder));
        dispatch(setSubmitting(false));
        dispatch(closeBookingModal());

        if (requestType === "pending_payment") {
          const confirmationModalData = {
            ...bookingData,
            bookingId: createdBookingOrder.bookingId || createdBookingOrder._id,
            bookingCode: createdBookingOrder.bookingCode,
            scheduleId: selectedSchedule || bookingData.scheduleId || null,
            isDirectBooking: true,
            amountToPay:
              createdBookingOrder.paymentBreakdown?.depositAmount > 0
                ? createdBookingOrder.paymentBreakdown.depositAmount
                : createdBookingOrder.amount,
            paymentTypeForConfirmation:
              createdBookingOrder.paymentBreakdown?.depositAmount > 0
                ? "deposit"
                : "full",
          };
          console.log(
            "Opening confirmation modal with:",
            confirmationModalData
          );
          dispatch(openConfirmationModal(confirmationModalData));
        } else {
          Swal.fire({
            icon: "success",
            title: "Đăng ký tư vấn thành công!",
            text: "Chúng tôi sẽ liên hệ với bạn để tư vấn chi tiết.",
            showConfirmButton: false,
            timer: 2500,
          });
          dispatch(closeBookingModal());
          dispatch(resetBookingForm());
        }

        return { success: true, data: createdBookingOrder };
      } else {
        throw new Error(
          response.data.message || `Yêu cầu (${requestType}) thất bại.`
        );
      }
    } catch (error) {
      dispatch(setSubmitting(false));
      const errorMessage =
        error.response?.data?.message || error.message || "Yêu cầu thất bại.";
      dispatch(genericBookingFailure(errorMessage));

      console.error(
        `Error in createBookingOrConsultationRequest (${requestType}):`,
        errorMessage,
        error
      );

      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  };

// Fetch consultation request
export const fetchConsultationRequest = (yachtId) => async (dispatch) => {
  dispatch({ type: "FETCH_CONSULTATION_REQUEST" });
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token xác thực.");
    }

    const response = await axios.get(
      "http://localhost:9999/api/v1/bookings/consultation",
      {
        params: { yachtId },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      dispatch({
        type: "FETCH_CONSULTATION_SUCCESS",
        payload: response.data.data,
      });
    } else {
      dispatch({
        type: "FETCH_CONSULTATION_FAILURE",
        payload: response.data.message,
      });
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Không log lỗi đỏ, chỉ coi như không có consultation
      dispatch({
        type: "FETCH_CONSULTATION_FAILURE",
        payload: null,
      });
    } else {
      dispatch({
        type: "FETCH_CONSULTATION_FAILURE",
        payload: error.message,
      });
      // Không log ra console để tránh lỗi đỏ
    }
  }
};
export const cancelConsultationRequestById =
  (bookingId) => async (dispatch) => {
    dispatch(setSubmitting(true));
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token xác thực.");

      const response = await axios.delete(
        `http://localhost:9999/api/v1/bookings/consultation/${bookingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        dispatch(clearConsultation());
        dispatch(setSubmitting(false));
        dispatch(resetBookingForm());
        Swal.fire({
          icon: "success",
          title: "Đã hủy yêu cầu tư vấn!",
          text: "Bạn có thể gửi một yêu cầu mới nếu muốn.",
          showConfirmButton: false,
          timer: 2500,
        });
        return { success: true };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      dispatch(setSubmitting(false));
      const errorMessage = error.response?.data?.message || error.message;
      Swal.fire({ icon: "error", title: "Lỗi!", text: errorMessage });
      return { success: false, error: errorMessage };
    }
  };
/**
 * CUSTOMER ACTION: Confirms a booking after consultation.
 * Calls POST /api/v1/bookings/:bookingId/confirm-consultation
 */
export const customerConfirmConsultation =
  (bookingId) => async (dispatch, getState) => {
    // `bookingId` là ID của BookingOrder đã được tạo từ `requestConsultation` và được nhân viên cập nhật
    dispatch(setSubmitting(true));
    dispatch(confirmConsultationRequest()); // Specific action for this step

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token xác thực.");

      // Lấy thông tin booking hiện tại từ state (nếu có và cần thiết, ví dụ scheduleId từ frontend)
      // const { bookingDetailsFromConsultation } = getState().booking;
      // const scheduleId = bookingDetailsFromConsultation?.scheduleId; // Ví dụ

      console.log("Customer confirming consultation for bookingId:", bookingId);
      const response = await axios.post(
        `http://localhost:9999/api/v1/bookings/${bookingId}/confirm-consultation`,
        {
          /* scheduleId: scheduleId (nếu cần gửi) */
        }, // Backend có thể không cần scheduleId nếu đã chốt
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("customerConfirmConsultation response:", response.data);

      if (response.data.success) {
        const updatedBookingData = response.data.data; // Đây là BookingOrder với status "pending_payment"
        dispatch(confirmConsultationSuccess(updatedBookingData));
        dispatch(setSubmitting(false));
        dispatch(closeConfirmationModal()); // Đóng modal xác nhận tư vấn (nếu có)

        // Lấy chi tiết booking đầy đủ SAU KHI KH xác nhận để có `paymentBreakdown` mới nhất
        const bookingDetailResult = await dispatch(
          fetchCustomerBookingDetail(bookingId)
        );

        if (bookingDetailResult.success) {
          // `currentBookingDetail` trong Redux state sẽ được cập nhật bởi fetchCustomerBookingDetail
          dispatch(openTransactionModal(bookingId)); // Mở modal thanh toán
          Swal.fire({
            icon: "success",
            title: "Đã xác nhận tư vấn!",
            text: "Booking đã được cập nhật. Vui lòng tiến hành thanh toán.",
            confirmButtonText: "OK",
          });
          dispatch(resetBookingForm());
          return { success: true, data: updatedBookingData };
        } else {
          throw new Error(
            "Không thể lấy thông tin chi tiết booking sau khi xác nhận tư vấn."
          );
        }
      } else {
        throw new Error(
          response.data.message || "Xác nhận booking sau tư vấn thất bại."
        );
      }
    } catch (error) {
      dispatch(setSubmitting(false));
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(confirmConsultationFailure(errorMessage));
      console.error(
        "customerConfirmConsultation error:",
        errorMessage,
        error.response?.data
      );
      Swal.fire({
        icon: "error",
        title: "Lỗi xác nhận!",
        text: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

/**
 * CUSTOMER ACTION: Customer cancels their own booking.
 * Calls PUT /api/v1/bookings/:bookingId/cancel
 */
export const customerCancelBooking = (bookingId) => async (dispatch) => {
  dispatch(setSubmitting(true));
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Không tìm thấy token xác thực.");

    const response = await axios.put(
      `http://localhost:9999/api/v1/bookings/${bookingId}/cancel`,
      {}, // Empty body if not needed
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("customerCancelBooking response:", response.data);

    if (response.data.success) {
      // Dispatch một action để cập nhật trạng thái booking trong Redux list (nếu có)
      dispatch(updateBookingStatusAction(bookingId, "cancelled")); // Cần tạo action creator này
      dispatch(closeConfirmationModal()); // Nếu đang ở modal xác nhận/chi tiết
      dispatch(closeBookingModal()); // Nếu đang ở modal booking
      dispatch(setSubmitting(false));
      Swal.fire({
        icon: "info",
        title: "Đã hủy booking",
        text: "Booking của bạn đã được hủy thành công.",
      });
      // Có thể cần fetch lại danh sách booking của KH
      dispatch(fetchCustomerBookings());
      return { success: true };
    } else {
      throw new Error(response.data.message || "Hủy booking thất bại.");
    }
  } catch (error) {
    dispatch(setSubmitting(false));
    const errorMessage = error.response?.data?.message || error.message;
    console.error(
      "customerCancelBooking error:",
      errorMessage,
      error.response?.data
    );
    Swal.fire({ icon: "error", title: "Lỗi hủy booking!", text: errorMessage });
    return { success: false, error: errorMessage };
  }
};

// === CUSTOMER BOOKING RETRIEVAL ACTIONS ===
/**
 * CUSTOMER ACTION: Fetch all bookings for the logged-in customer.
 * Calls GET /api/v1/bookings/my-bookings
 */
export const fetchCustomerBookings = () => async (dispatch) => {
  dispatch({ type: "FETCH_CUSTOMER_BOOKINGS_REQUEST" });
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Không tìm thấy token xác thực.");

    const response = await axios.get(
      "http://localhost:9999/api/v1/bookings/my-bookings",
      { headers: { Authorization: `Bearer ${token}` } }
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

/**
 * CUSTOMER ACTION: Fetches detail of a specific booking for the customer.
 * Calls GET /api/v1/bookings/:bookingId/my-detail
 */
export const fetchCustomerBookingDetail = (bookingId) => async (dispatch) => {
  dispatch(fetchBookingDetailRequest()); // Sử dụng action đã có nếu phù hợp
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Không tìm thấy token xác thực.");

    // Đảm bảo endpoint này trả về đầy đủ thông tin cần thiết, bao gồm cả paymentBreakdown
    const response = await axios.get(
      `http://localhost:9999/api/v1/bookings/${bookingId}/my-detail`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("fetchCustomerBookingDetail response:", response.data);

    if (response.data.success) {
      dispatch(fetchBookingDetailSuccess(response.data.data)); // Cập nhật currentBookingDetail
      return { success: true, data: response.data.data };
    } else {
      throw new Error(response.data.message || "Lỗi lấy chi tiết booking");
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(fetchBookingDetailFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

// ==================== PAYMENT ASYNC ACTIONS (CUSTOMER) ====================

export const createDepositPayment =
  (bookingId, paymentMethod = "bank_transfer") =>
  async (dispatch, getState) => {
    dispatch(createTransactionRequest());
    dispatch(setSubmitting(true));
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token xác thực.");

      // Không cần lấy currentBookingDetail từ state nữa, backend sẽ tính toán
      console.log(
        "Calling deposit API with bookingId:",
        bookingId,
        "Method:",
        paymentMethod
      );
      const response = await axios.post(
        "http://localhost:9999/api/v1/payments/deposit",
        { bookingId, paymentMethod }, // Gửi cả paymentMethod
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("createDepositPayment response:", response.data);

      if (response.data.success) {
        const paymentInitiationData = response.data.data;
        dispatch(createTransactionSuccess(paymentInitiationData));
        dispatch(setQRCodeData(paymentInitiationData)); // setQRCodeData nên nhận paymentInitiationData
        dispatch(setSubmitting(false));

        if (
          paymentInitiationData.transactionId &&
          paymentMethod !== "bank_transfer"
        ) {
          // Chỉ poll nếu không phải bank_transfer
          dispatch(
            startPaymentStatusPolling(paymentInitiationData.transactionId)
          );
        } else if (paymentMethod === "bank_transfer") {
          // Với bank transfer, hiển thị thông báo và không polling.
          Swal.fire({
            title: "Thông tin chuyển khoản",
            html: `
                    <p>Vui lòng thanh toán <strong>${paymentInitiationData.amount?.toLocaleString(
                      "vi-VN"
                    )} VNĐ</strong> vào tài khoản:</p>
                    <p>Ngân hàng: <strong>${
                      paymentInitiationData.bankInfo?.bankName
                    }</strong></p>
                    <p>Số tài khoản: <strong>${
                      paymentInitiationData.bankInfo?.accountNumber
                    }</strong></p>
                    <p>Chủ tài khoản: <strong>${
                      paymentInitiationData.bankInfo?.accountName
                    }</strong></p>
                    <p>Nội dung CK: <strong>${
                      paymentInitiationData.bankInfo?.transferContent
                    }</strong></p>
                    <small>Hết hạn: ${new Date(
                      paymentInitiationData.expiredAt
                    ).toLocaleString("vi-VN")}</small>`,
            icon: "info",
            confirmButtonText: "Đã hiểu",
          }).then(() => {
            dispatch(closeTransactionModal()); // Đóng modal sau khi KH xem thông tin
          });
        }
        return { success: true, data: paymentInitiationData };
      } else {
        throw new Error(
          response.data.message || "Tạo thanh toán cọc thất bại."
        );
      }
    } catch (error) {
      dispatch(setSubmitting(false));
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(createTransactionFailure(errorMessage));
      console.error(
        "createDepositPayment error:",
        errorMessage,
        error.response?.data
      );
      Swal.fire({
        icon: "error",
        title: "Lỗi tạo thanh toán cọc!",
        text: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

export const createFullPayment =
  (bookingId, paymentMethod = "bank_transfer") =>
  async (dispatch, getState) => {
    dispatch(createTransactionRequest());
    dispatch(setSubmitting(true));
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token xác thực.");

      console.log(
        "Calling full payment API with bookingId:",
        bookingId,
        "Method:",
        paymentMethod
      );
      const response = await axios.post(
        "http://localhost:9999/api/v1/payments/full",
        { bookingId, paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("createFullPayment response:", response.data);

      if (response.data.success) {
        const paymentInitiationData = response.data.data;
        dispatch(createTransactionSuccess(paymentInitiationData));
        dispatch(setQRCodeData(paymentInitiationData));
        dispatch(setSubmitting(false));
        if (
          paymentInitiationData.transactionId &&
          paymentMethod !== "bank_transfer"
        ) {
          dispatch(
            startPaymentStatusPolling(paymentInitiationData.transactionId)
          );
        } else if (paymentMethod === "bank_transfer") {
          Swal.fire({
            title: "Thông tin chuyển khoản",
            html: `
                <p>Vui lòng thanh toán <strong>${paymentInitiationData.amount?.toLocaleString(
                  "vi-VN"
                )} VNĐ</strong> vào tài khoản:</p>
                <p>Ngân hàng: <strong>${
                  paymentInitiationData.bankInfo?.bankName
                }</strong></p>
                <p>Số tài khoản: <strong>${
                  paymentInitiationData.bankInfo?.accountNumber
                }</strong></p>
                <p>Chủ tài khoản: <strong>${
                  paymentInitiationData.bankInfo?.accountName
                }</strong></p>
                <p>Nội dung CK: <strong>${
                  paymentInitiationData.bankInfo?.transferContent
                }</strong></p>
                <small>Hết hạn: ${new Date(
                  paymentInitiationData.expiredAt
                ).toLocaleString("vi-VN")}</small>`,
            icon: "info",
            confirmButtonText: "Đã hiểu",
          }).then(() => {
            dispatch(closeTransactionModal());
          });
        }
        return { success: true, data: paymentInitiationData };
      } else {
        throw new Error(
          response.data.message || "Tạo thanh toán đầy đủ thất bại."
        );
      }
    } catch (error) {
      dispatch(setSubmitting(false));
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(createTransactionFailure(errorMessage));
      console.error(
        "createFullPayment error:",
        errorMessage,
        error.response?.data
      );
      Swal.fire({
        icon: "error",
        title: "Lỗi tạo thanh toán!",
        text: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

export const startPaymentStatusPolling =
  (transactionIdOrRef) => async (dispatch, getState) => {
    // Check an toàn: chỉ poll nếu chưa có polling nào khác đang chạy cho ID này
    const { currentPollingId, isPolling } = getState().payment; // Giả sử payment slice có các state này
    if (isPolling && currentPollingId === transactionIdOrRef) {
      console.log(`Polling for ${transactionIdOrRef} is already active.`);
      return;
    }
    if (
      isPolling &&
      currentPollingId &&
      currentPollingId !== transactionIdOrRef
    ) {
      // Nếu đang poll một giao dịch khác, dừng nó trước
      dispatch(stopPaymentStatusPolling()); // Action này sẽ clear interval cũ
    }

    dispatch(startPaymentPolling(transactionIdOrRef)); // Sets isPolling = true and currentPollingId

    pollingInterval = setInterval(async () => {
      // Kiểm tra trong interval xem có nên dừng không (ví dụ: người dùng đóng modal)
      const stillPollingThisId =
        getState().payment.currentPollingId === transactionIdOrRef &&
        getState().payment.isPolling;
      if (!stillPollingThisId) {
        if (pollingInterval) clearInterval(pollingInterval);
        pollingInterval = null;
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // Nếu token mất giữa chừng
          dispatch(stopPaymentStatusPolling());
          return;
        }
        // Route: /api/v1/payments/transaction/:transactionIdOrRef/status
        const response = await axios.get(
          `http://localhost:9999/api/v1/payments/transaction/${transactionIdOrRef}/status`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(
          `Polling status for ${transactionIdOrRef}:`,
          response.data.data?.status
        );

        const transaction = response.data.data;
        dispatch(updatePaymentStatus(transaction.status)); // Cập nhật payment.status trong Redux

        if (transaction.status === "completed") {
          dispatch(stopPaymentStatusPolling()); // Dừng polling
          dispatch(handlePaymentSuccess(transaction._id)); // Xử lý thành công (dùng _id là ObjectId)
        } else if (
          ["failed", "cancelled", "expired"].includes(transaction.status)
        ) {
          dispatch(stopPaymentStatusPolling()); // Dừng polling
          Swal.fire({
            icon: "error",
            title: `Thanh toán ${
              transaction.statusDisplay || transaction.status
            }!`,
            text:
              transaction.failureReason ||
              "Giao dịch không thành công. Vui lòng thử lại.",
          });
          dispatch(clearQRCodeData()); // Xóa QR/payment info
          // Không đóng transaction modal ở đây, để KH thấy lỗi. Có thể thêm nút đóng
        }
        // Nếu status vẫn là pending, không làm gì cả, interval sẽ chạy lại
      } catch (error) {
        console.error("Error polling payment status:", error);
        // Xem xét dừng polling nếu lỗi mạng liên tục hoặc lỗi 401/403
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          dispatch(stopPaymentStatusPolling());
        }
      }
    }, 5000); // Tăng thời gian polling lên 5s
  };

export const stopPaymentStatusPolling = () => (dispatch) => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
    console.log("Payment polling stopped.");
  }
  dispatch(stopPaymentPolling()); // Action creator để set isPolling = false, currentPollingId = null
};
export const handlePaymentSuccess =
  (completedTransactionId) => async (dispatch) => {
    dispatch(fetchInvoiceRequest());
    try {
      const token = localStorage.getItem("token");
      // API from invoiceRoutes.js: router.get('/by-transaction/:transactionId', ...)
      const response = await axios.get(
        `http://localhost:9999/api/v1/invoices/by-transaction/${completedTransactionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("handlePaymentSuccess - fetched invoice:", response.data);

      if (response.data.success) {
        const invoiceData = response.data.data;
        dispatch(fetchInvoiceSuccess(invoiceData));
        dispatch(clearQRCodeData()); // Clear QR data from payment slice
        dispatch(closeTransactionModal());
        dispatch(openInvoiceModal(invoiceData)); // Open invoice modal with the data

        Swal.fire({
          icon: "success",
          title: "Thanh toán thành công!",
          text: "Hóa đơn đã được tạo. Cảm ơn bạn đã sử dụng dịch vụ!",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        throw new Error(
          response.data.message || "Không thể lấy hóa đơn sau khi thanh toán."
        );
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(fetchInvoiceFailure(errorMessage));
      console.error(
        "Error in handlePaymentSuccess (fetching invoice):",
        errorMessage,
        error.response?.data
      );
      // Even if invoice fetch fails, payment was successful. Maybe just close transaction modal.
      dispatch(clearQRCodeData());
      dispatch(closeTransactionModal());
      Swal.fire({
        icon: "warning",
        title: "Thanh toán thành công nhưng có lỗi lấy hóa đơn",
        text: `Vui lòng kiểm tra lịch sử giao dịch. Lỗi: ${errorMessage}`,
      });
    }
  };

// downloadInvoicePDF and simulatePaymentSuccess remain similar
export const simulatePaymentSuccess = (transactionId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `http://localhost:9999/api/v1/payments/transaction/${transactionId}/simulate`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("simulatePaymentSuccess response:", response.data);

    if (response.data.success) {
      Swal.fire({
        icon: "info",
        title: "Mô phỏng thanh toán",
        text: "Yêu cầu mô phỏng đã được gửi. Trạng thái sẽ cập nhật sau giây lát.",
        timer: 2000,
        showConfirmButton: false,
      });
      // Gọi luôn handlePaymentSuccess để chuyển sang invoice ngay
      dispatch(handlePaymentSuccess(transactionId));
    } else {
      throw new Error(response.data.message || "Mô phỏng thất bại từ server.");
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error(
      "Error simulating payment:",
      errorMessage,
      error.response?.data
    );
    Swal.fire({
      icon: "error",
      title: "Lỗi mô phỏng thanh toán!",
      text: errorMessage,
    });
  }
};

export const downloadInvoicePDF = (invoiceId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    // API from invoiceRoutes.js: router.get('/:id/download', ...)
    const response = await axios.get(
      `http://localhost:9999/api/v1/invoices/${invoiceId}/download`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // Important for file download
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    const contentDisposition = response.headers["content-disposition"];
    let filename = `invoice-${invoiceId}.pdf`; // Default filename
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
      if (filenameMatch.length === 2) filename = filenameMatch[1];
    }
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url); // Clean up

    Swal.fire({
      icon: "success",
      title: "Tải xuống thành công!",
      text: "Hóa đơn đã được tải xuống.",
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Không thể tải xuống hóa đơn.";
    console.error(
      "downloadInvoicePDF error:",
      errorMessage,
      error.response?.data
    );
    Swal.fire({ icon: "error", title: "Lỗi tải xuống!", text: errorMessage });
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

export const fetchInvoiceByTransactionId =
  (transactionId) => async (dispatch, getState) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:9999/api/v1/invoices/by-transaction/${transactionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        dispatch(setInvoiceData(response.data.data));
        dispatch(openInvoiceModal(response.data.data));
      } else {
        throw new Error(response.data.message || "Không tìm thấy hóa đơn.");
      }
    } catch (error) {
      console.error("Lỗi lấy hóa đơn:", error);
    }
  };
