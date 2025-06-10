import axios from "axios";
import * as paymentActions from "../actions/paymentActions";

import Swal from "sweetalert2";
import {
  setSubmitting,
  fetchInvoiceRequest,
  fetchInvoiceSuccess,
  fetchInvoiceFailure,
  closeTransactionModal,
  openInvoiceModal,
} from "../actions";

let pollingInterval = null;

export const createDepositPayment =
  (bookingId, paymentMethod = "bank_transfer") =>
  async (dispatch, getState) => {
    dispatch(paymentActions.createTransactionRequest());
    dispatch(setSubmitting(true));
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token xác thực.");
      const response = await axios.post(
        "http://localhost:9999/api/v1/payments/deposit",
        { bookingId, paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        const paymentInitiationData = response.data.data;
        dispatch(
          paymentActions.createTransactionSuccess(paymentInitiationData)
        );
        dispatch(paymentActions.setQRCodeData(paymentInitiationData));
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
            )}
            VNĐ</strong> vào tài khoản:</p>
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
      dispatch(paymentActions.createTransactionFailure(errorMessage));
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
    dispatch(paymentActions.createTransactionRequest());
    dispatch(setSubmitting(true));
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token xác thực.");
      const response = await axios.post(
        "http://localhost:9999/api/v1/payments/full",
        { bookingId, paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        const paymentInitiationData = response.data.data;
        dispatch(
          paymentActions.createTransactionSuccess(paymentInitiationData)
        );
        dispatch(paymentActions.setQRCodeData(paymentInitiationData));
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
            )}
            VNĐ</strong> vào tài khoản:</p>
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
      dispatch(paymentActions.createTransactionFailure(errorMessage));
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
    const { currentPollingId, isPolling } = getState().payment;
    if (isPolling && currentPollingId === transactionIdOrRef) {
      return;
    }
    if (
      isPolling &&
      currentPollingId &&
      currentPollingId !== transactionIdOrRef
    ) {
      dispatch(stopPaymentStatusPolling());
    }
    dispatch(paymentActions.startPaymentPolling(transactionIdOrRef));
    pollingInterval = setInterval(async () => {
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
          dispatch(stopPaymentStatusPolling());
          return;
        }
        const response = await axios.get(
          `http://localhost:9999/api/v1/payments/transaction/${transactionIdOrRef}/status`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const transaction = response.data.data;
        dispatch(paymentActions.updatePaymentStatus(transaction.status));
        if (transaction.status === "completed") {
          dispatch(stopPaymentStatusPolling());
          dispatch(handlePaymentSuccess(transaction._id));
        } else if (
          ["failed", "cancelled", "expired"].includes(transaction.status)
        ) {
          dispatch(stopPaymentStatusPolling());
          Swal.fire({
            icon: "error",
            title: `Thanh toán ${
              transaction.statusDisplay || transaction.status
            }!`,
            text:
              transaction.failureReason ||
              "Giao dịch không thành công. Vui lòng thử lại.",
          });
          dispatch(paymentActions.clearQRCodeData());
        }
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          dispatch(stopPaymentStatusPolling());
        }
      }
    }, 5000);
  };

export const stopPaymentStatusPolling = () => (dispatch) => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
  dispatch(paymentActions.stopPaymentPolling());
};

export const handlePaymentSuccess =
  (completedTransactionId) => async (dispatch) => {
    dispatch(fetchInvoiceRequest());
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:9999/api/v1/invoices/by-transaction/${completedTransactionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        const invoiceData = response.data.data;
        dispatch(fetchInvoiceSuccess(invoiceData));
        dispatch(paymentActions.clearQRCodeData());
        dispatch(closeTransactionModal());
        dispatch(openInvoiceModal(invoiceData));
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
      dispatch(paymentActions.clearQRCodeData());
      dispatch(closeTransactionModal());
      Swal.fire({
        icon: "warning",
        title: "Thanh toán thành công nhưng có lỗi lấy hóa đơn",
        text: `Vui lòng kiểm tra lịch sử giao dịch. Lỗi: ${errorMessage}`,
      });
    }
  };

export const simulatePaymentSuccess = (transactionId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `http://localhost:9999/api/v1/payments/transaction/${transactionId}/simulate`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.success) {
      Swal.fire({
        icon: "info",
        title: "Mô phỏng thanh toán",
        text: "Yêu cầu mô phỏng đã được gửi. Trạng thái sẽ cập nhật sau giây lát.",
        timer: 2000,
        showConfirmButton: false,
      });
      dispatch(handlePaymentSuccess(transactionId));
    } else {
      throw new Error(response.data.message || "Mô phỏng thất bại từ server.");
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    Swal.fire({
      icon: "error",
      title: "Lỗi mô phỏng thanh toán!",
      text: errorMessage,
    });
  }
};
