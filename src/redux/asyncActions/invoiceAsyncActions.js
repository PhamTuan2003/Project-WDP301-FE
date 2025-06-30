import axios from "axios";
import { setInvoiceData } from "../actions/uiActions";
import { openInvoiceModal } from "../actions/uiActions";

export const downloadInvoicePDF = (invoiceId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:9999/api/v1/invoices/${invoiceId}/download`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    const contentDisposition = response.headers["content-disposition"];
    let filename = `invoice-${invoiceId}.pdf`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
      if (filenameMatch.length === 2) filename = filenameMatch[1];
    }
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    // Handle error if needed
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
      // Handle error if needed
    }
  };

export const fetchInvoiceByBookingId = (bookingId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:9999/api/v1/invoices/by-booking/${bookingId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.success) {
      dispatch(setInvoiceData(response.data.data));
      dispatch(openInvoiceModal(response.data.data));
      return { payload: response.data.data };
    } else {
      throw new Error(response.data.message || "Không tìm thấy hóa đơn.");
    }
  } catch (error) {
    // Handle error if needed
    return { error: error.message };
  }
};

// import các action cần thiết từ actions/invoiceActions nếu cần
// Ví dụ:
// export const downloadInvoicePDF = (invoiceId) => async (dispatch) => {
//   // ... logic ...
// };
// ... (Các async action invoice khác sẽ được thêm tiếp vào file này)
