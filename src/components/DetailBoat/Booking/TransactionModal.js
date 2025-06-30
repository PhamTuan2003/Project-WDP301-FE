import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  X,
  CreditCard,
  Percent,
  QrCode,
  CheckCircle,
  Info,
  Banknote,
  Smartphone,
  Calendar,
  ArrowRight,
  AlertCircle,
  Loader2,
  Copy,
  ExternalLink,
  Building,
  Timer,
  Users,
  ArrowLeft,
} from "lucide-react";
import {
  createDepositPayment,
  createFullPayment,
  simulatePaymentSuccess,
  stopPaymentStatusPolling,
  cancelTransaction,
} from "../../../redux/asyncActions/paymentAsyncActions";
import {
  fetchCustomerBookingDetail,
  fetchCustomerBookings,
} from "../../../redux/asyncActions/bookingAsyncActions";
import { fetchInvoiceByTransactionId } from "../../../redux/asyncActions/invoiceAsyncActions";
import { formatPrice } from "../../../redux/validation";
import {
  clearQRCodeData,
  closeTransactionModal,
  setActivePaymentTab,
} from "../../../redux/actions";
import Swal from "sweetalert2";

if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `.swal-archivo-font { font-family: 'Archivo', sans-serif !important; }`;
  document.head.appendChild(style);
}

const TransactionModal = ({ onBack }) => {
  const dispatch = useDispatch();
  const { showTransactionModal, bookingIdFortransaction } = useSelector(
    (state) => state.ui.modals
  );
  const { activePaymentTab } = useSelector((state) => state.ui);
  const {
    currentBookingDetail,
    submitting: bookingSubmitting,
    error: bookingError,
  } = useSelector((state) => state.booking);
  const {
    qrCodeData,
    paymentStatus,
    loading: paymentLoading,
    isPolling,
  } = useSelector((state) => state.payment);
  const { confirmationData } = useSelector((state) => state.ui.modals);

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("bank_transfer");
  const [isVisible, setIsVisible] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [showBankInfo, setShowBankInfo] = useState(true);
  const [randomQR, setRandomQR] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (showTransactionModal) {
      setIsVisible(true);
      if (bookingIdFortransaction) {
        dispatch(fetchCustomerBookingDetail(bookingIdFortransaction));
      }
    }
    return () => {
      if (isPolling) {
        dispatch(stopPaymentStatusPolling());
      }
    };
  }, [showTransactionModal, bookingIdFortransaction, dispatch, isPolling]);

  useEffect(() => {
    if (
      (paymentStatus === "fully_paid" || paymentStatus === "deposit_paid") &&
      showTransactionModal
    ) {
      if (
        process.env.NODE_ENV === "development" &&
        qrCodeData?.paymentMethod === "bank_transfer"
      ) {
        return;
      }
      // Chỉ xóa bookingId khỏi localStorage khi không còn ở trạng thái test simulate
      localStorage.removeItem("bookingIdForTransaction");
      dispatch(closeTransactionModal());
      dispatch(clearQRCodeData());
      const transactionId = qrCodeData?.transactionId;
      if (transactionId) {
        dispatch(fetchInvoiceByTransactionId(transactionId));
      }
      if (bookingIdFortransaction) {
        dispatch(fetchCustomerBookingDetail(bookingIdFortransaction));
      }
      // Thêm dòng này để cập nhật danh sách booking ngay sau khi thanh toán thành công
      dispatch(fetchCustomerBookings());
    }
  }, [paymentStatus, showTransactionModal]);

  useEffect(() => {
    if (showTransactionModal && bookingIdFortransaction) {
      localStorage.setItem("bookingIdForTransaction", bookingIdFortransaction);
    }
    // Nếu modal đóng hoặc bookingIdFortransaction không còn, xóa localStorage
    if (!showTransactionModal || !bookingIdFortransaction) {
      localStorage.removeItem("bookingIdForTransaction");
    }
  }, [showTransactionModal, bookingIdFortransaction]);

  useEffect(() => {
    const savedId = localStorage.getItem("bookingIdForTransaction");
    if (!showTransactionModal && savedId) {
      if (savedId !== bookingIdFortransaction) {
        dispatch({
          type: "OPEN_TRANSACTION_MODAL",
          payload: { bookingId: savedId },
        });
      }
    }
    // eslint-disable-next-line
  }, []);

  // Reset randomQR khi có qrCodeData hoặc đóng modal
  useEffect(() => {
    if (qrCodeData || !showTransactionModal) {
      setRandomQR(null);
    }
  }, [qrCodeData, showTransactionModal]);

  // Hàm sinh QR ngẫu nhiên
  const generateRandomQR = (amount, bookingCode, method) => {
    // Chuỗi QR có thể là JSON hoặc text, ở đây dùng JSON
    const data = {
      type: "test",
      method,
      amount,
      bookingCode,
      time: Date.now(),
      random: Math.random().toString(36).substring(2, 10),
    };
    return JSON.stringify(data);
  };

  // Khi chọn phương thức thanh toán
  const handleSelectPaymentMethod = (method) => {
    if (!paymentLoading && !qrCodeData) {
      setSelectedPaymentMethod(method);
      // Sinh QR ngẫu nhiên tương ứng
      let amount =
        activePaymentTab === 0 ? amountForDepositTab : amountForFullTab;
      setRandomQR({
        qrData: generateRandomQR(amount, booking.bookingCode, method),
        amount,
        bookingCode: booking.bookingCode,
        method,
      });
    }
  };

  // Khi chuyển tab thanh toán
  const handleTabChange = (tabIndex) => {
    if (!paymentLoading && !qrCodeData) {
      dispatch(setActivePaymentTab(tabIndex));
      // Sinh QR ngẫu nhiên tương ứng
      let amount = tabIndex === 0 ? amountForDepositTab : amountForFullTab;
      setRandomQR({
        qrData: generateRandomQR(
          amount,
          booking.bookingCode,
          selectedPaymentMethod
        ),
        amount,
        bookingCode: booking.bookingCode,
        method: selectedPaymentMethod,
      });
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      dispatch(closeTransactionModal());
      dispatch(clearQRCodeData());
      if (isPolling) {
        dispatch(stopPaymentStatusPolling());
      }
      // Xóa bookingId khỏi localStorage khi đóng modal
      localStorage.removeItem("bookingIdForTransaction");
    }, 300);
  };

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(""), 2000);
    } catch (err) {}
  };

  const handleBack = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (typeof onBack === "function") {
      onBack();
    } else {
      dispatch(closeTransactionModal());
    }
  };

  // Hàm chuyển bước
  const goToStep = (step) => {
    setCurrentStep(step);
    if (step === 1) {
      dispatch(clearQRCodeData());
      setRandomQR(null);
      setShowBankInfo(true);
    } else if (step === 2) {
      dispatch(clearQRCodeData());
      setRandomQR(null);
      setShowBankInfo(true);
    }
  };

  // Hàm kiểm tra transaction pending (giả lập, cần thay bằng API thực tế nếu có)
  const getPendingTransactionIdForBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:9999/api/v1/payments/booking/${bookingId}/pending-transaction`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) return null;
      const data = await res.json();
      return data.success ? data.data.transactionId : null;
    } catch {
      return null;
    }
  };

  const handleBackToChooseMethod = async () => {
    const pendingTransactionId = await getPendingTransactionIdForBooking(
      bookingIdFortransaction
    );
    if (pendingTransactionId) {
      Swal.fire({
        icon: "warning",
        title: "Bạn đang có giao dịch chưa hoàn tất",
        html: `
          <div style="text-align:center; font-family: 'Archivo', sans-serif;">
            <b>Chỉ có thể tạo một giao dịch thanh toán cho mỗi booking tại một thời điểm.</b><br/>
            <ul style="margin:8px 0 0 18px;padding:0;">
              <li>Chọn <b>Hủy</b> để tiếp tục thanh toán với phương thức cũ.</li>
              <li>Chọn <b>Tạo giao dịch mới</b> để hủy giao dịch cũ và chọn lại phương thức thanh toán.</li>
            </ul>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Hủy",
        cancelButtonText: "Tạo giao dịch mới",
      }).then(async (result) => {
        if (result.isConfirmed) {
          dispatch({
            type: "OPEN_TRANSACTION_MODAL",
            payload: {
              bookingId: bookingIdFortransaction,
              transactionId: pendingTransactionId,
            },
          });
        } else {
          // Gọi API cancel transaction pending trước khi reset state
          const success = await dispatch(
            cancelTransaction(pendingTransactionId)
          );
          if (success) {
            setRandomQR(null);
            setShowBankInfo(true);
            Swal.fire({
              icon: "success",
              title: "Đã hủy giao dịch cũ!",
              text: "Bạn có thể chọn lại phương thức thanh toán và tạo giao dịch mới.",
              timer: 2000,
              showConfirmButton: false,
              customClass: { popup: "swal-archivo-font" },
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Không thể hủy giao dịch cũ!",
              text: "Vui lòng thử lại hoặc liên hệ hỗ trợ.",
              customClass: { popup: "swal-archivo-font" },
            });
          }
        }
      });
    } else {
      dispatch(clearQRCodeData());
      dispatch({ type: "CREATE_TRANSACTION_SUCCESS", payload: null });
      dispatch({ type: "UPDATE_PAYMENT_STATUS", payload: "idle" });
      setRandomQR(null);
      setShowBankInfo(true);
      Swal.fire({
        icon: "info",
        title: "Không có giao dịch nào đang chờ",
        text: "Bạn có thể tạo giao dịch mới hoặc chọn phương thức thanh toán khác.",
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: "swal-archivo-font" },
      });
    }
  };

  if (!showTransactionModal) return null;

  // Error State
  if (bookingError) {
    return (
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
          isVisible ? "bg-black/60 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div
          className={`transform transition-all duration-300 ${
            isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-red-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Có lỗi xảy ra
              </h3>
              <p className="text-red-600 mb-6">{bookingError}</p>
              <button
                onClick={handleClose}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading State
  if (
    bookingSubmitting ||
    !currentBookingDetail ||
    (currentBookingDetail.booking &&
      currentBookingDetail.booking._id !== bookingIdFortransaction)
  ) {
    return (
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
          isVisible ? "bg-black/60 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div
          className={`transform transition-all duration-300 ${
            isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Đang tải thông tin
              </h3>
              <p className="text-gray-600 mb-4">
                Vui lòng chờ trong giây lát...
              </p>
              <div className="flex justify-center">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const booking = currentBookingDetail.booking;
  const totalAmount =
    booking.paymentBreakdown?.totalAmount || booking.amount || 0;
  const depositAmountValue = booking.paymentBreakdown?.depositAmount || 0;
  const remainingAmountValue =
    booking.paymentBreakdown?.remainingAmount || totalAmount;
  const amountForDepositTab = depositAmountValue;
  const amountForFullTab =
    booking.paymentBreakdown?.totalPaid === 0
      ? totalAmount
      : remainingAmountValue;

  // Nếu thiếu childrenUnder10/childrenAbove10, lấy từ confirmationData
  const adults = Number(
    booking.guestCounter?.adults ??
      booking.adults ??
      confirmationData?.adults ??
      confirmationData?.guestCounter?.adults ??
      1
  );
  const childrenUnder10 =
    booking.guestCounter?.childrenUnder10 ??
    booking.childrenUnder10 ??
    confirmationData?.childrenUnder10 ??
    confirmationData?.guestCounter?.childrenUnder10 ??
    0;
  const childrenAbove10 =
    booking.guestCounter?.childrenAbove10 ??
    booking.childrenAbove10 ??
    confirmationData?.childrenAbove10 ??
    confirmationData?.guestCounter?.childrenAbove10 ??
    0;

  const totalGuests = adults + Math.ceil(childrenAbove10 / 2);
  const bookedRooms = currentBookingDetail.bookedRooms || [];
  const totalRooms = bookedRooms.reduce((sum, r) => sum + (r.quantity || 0), 0);

  const bookedServices =
    currentBookingDetail.bookedServices &&
    currentBookingDetail.bookedServices.length > 0
      ? currentBookingDetail.bookedServices
      : booking.consultationData.requestServices ||
        booking.consultationData.selectedServices ||
        [];
  const handleDepositPayment = async () => {
    if (!bookingIdFortransaction) return;
    dispatch(
      createDepositPayment(bookingIdFortransaction, selectedPaymentMethod)
    );
  };

  const handleFullOrRemainingPayment = async () => {
    if (!bookingIdFortransaction) return;
    dispatch(createFullPayment(bookingIdFortransaction, selectedPaymentMethod));
  };

  const handleSimulatePayment = () => {
    if (qrCodeData?.transactionId) {
      dispatch(simulatePaymentSuccess(qrCodeData.transactionId)).then(() => {
        // Sau khi mô phỏng thành công, cập nhật lại booking detail
        if (bookingIdFortransaction) {
          dispatch(fetchCustomerBookingDetail(bookingIdFortransaction));
        }
      });
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "bank_transfer":
        return <Banknote className="w-5 h-5" />;
      case "vnpay":
        return <CreditCard className="w-5 h-5" />;
      case "momo":
        return <Smartphone className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "fully_paid":
        return "text-green-600 bg-green-50";
      case "deposit_paid":
        return "text-yellow-600 bg-yellow-50";
      case "pending":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case "fully_paid":
        return "Đã thanh toán";
      case "deposit_paid":
        return "Đã đặt cọc";
      case "pending":
        return "Chờ thanh toán";
      default:
        return "Chưa thanh toán";
    }
  };

  const renderBookingInfo = () => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-3 mb-6 border border-blue-100">
      <div className="flex items-center justify-between pb-3">
        <h3 className="text-base  font-semibold text-gray-900 flex items-center">
          <Calendar className="w-5 h-5 mr-2  text-blue-600" />
          Thông tin booking
        </h3>
        <span
          className={`px-2 rounded-full bg-white border border-gray-600 text-xs font-medium ${getPaymentStatusColor(
            booking.paymentStatus
          )}`}
        >
          {getPaymentStatusText(booking.paymentStatus)}
        </span>
      </div>

      <div className="grid grid-cols-1 border-t border-blue-100 gap-2">
        <div className="flex items-center justify-between py-2 border-b border-blue-100">
          <span className="text-gray-600 flex items-center">
            <Building className="w-4 h-4 mr-2" />
            Mã booking
          </span>
          <span className="font-semibold text-gray-900">
            {booking.bookingCode}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-blue-100">
          <span className="text-gray-600 flex items-center">
            <Banknote className="w-4 h-4 mr-2" />
            Tổng tiền
          </span>
          <span className="font-bold text-lg text-blue-600">
            {formatPrice(totalAmount)}
          </span>
        </div>

        {booking.paymentBreakdown?.totalPaid > 0 && (
          <div className="flex items-center justify-between py-2 border-b border-blue-100">
            <span className="text-gray-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Đã thanh toán
            </span>
            <span className="font-semibold text-green-600">
              {formatPrice(booking.paymentBreakdown.totalPaid)}
            </span>
          </div>
        )}

        {booking.paymentBreakdown?.depositAmount > 0 &&
          booking.paymentStatus !== "deposit_paid" &&
          booking.paymentStatus !== "fully_paid" && (
            <div className="flex items-center justify-between py-2 border-b border-blue-100">
              <span className="text-gray-600 flex items-center">
                <Percent className="w-4 h-4 mr-2" />
                Tiền cọc
              </span>
              <span className="font-semibold text-orange-600">
                {formatPrice(booking.paymentBreakdown.depositAmount)}
              </span>
            </div>
          )}

        {booking.paymentStatus === "deposit_paid" &&
          booking.paymentBreakdown?.remainingAmount > 0 && (
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600 flex items-center">
                <Timer className="w-4 h-4 mr-2" />
                Còn lại
              </span>
              <span className="font-semibold text-red-600">
                {formatPrice(booking.paymentBreakdown.remainingAmount)}
              </span>
            </div>
          )}

        <div className="flex items-center justify-between py-2 border-b border-blue-100">
          <span className="text-gray-600 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Số khách
          </span>
          <span className="font-semibold text-gray-900">
            {totalGuests} khách
          </span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-blue-100">
          <span className="text-gray-600 flex items-center">
            <Building className="w-4 h-4 mr-2" />
            Số phòng đặt
          </span>
          <span className="font-semibold text-gray-900">
            {totalRooms} phòng
          </span>
        </div>
        {bookedRooms.length > 0 && (
          <div className="py-2">
            <ul className="text-sm text-gray-700 list-disc ml-6">
              {bookedRooms.map((room, idx) => (
                <li key={room._id || idx}>
                  {room.roomId?.name || room.name || "Phòng"} x {room.quantity}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Ngày đặt */}
        <div className="flex items-center justify-between py-2 border-b border-blue-100">
          <span className="text-gray-600 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Ngày đặt
          </span>
          <span className="font-semibold text-gray-900">
            {booking.checkInDate
              ? new Date(booking.checkInDate).toLocaleDateString("vi-VN")
              : booking.createdAt
              ? new Date(booking.createdAt).toLocaleDateString("vi-VN")
              : "-"}
          </span>
        </div>
        {/* Dịch vụ */}
        {bookedServices.length > 0 && (
          <div className="py-2">
            <span className="text-gray-600 flex items-center mb-1">
              <Info className="w-4 h-4 mr-2" />
              Dịch vụ đã chọn
            </span>
            <ul className="text-sm text-gray-700 list-disc ml-6">
              {bookedServices.map((service, idx) => (
                <li key={service.serviceId || service._id || idx}>
                  {service.serviceName || service.name || "Dịch vụ"}
                  {service.serviceQuantity || service.quantity
                    ? ` x ${service.serviceQuantity || service.quantity}`
                    : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  const renderPaymentMethods = () => (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-900 pb-2">
        Chọn phương thức thanh toán
      </label>
      <div className="grid grid-cols-1 gap-2">
        {[
          {
            value: "bank_transfer",
            label: "Chuyển khoản ngân hàng",
            icon: Banknote,
            color: "blue",
          },
          { value: "vnpay", label: "VNPay", icon: CreditCard, color: "cyan" },
          { value: "momo", label: "MoMo", icon: Smartphone, color: "red" },
        ].map((method) => {
          const Icon = method.icon;
          const isSelected = selectedPaymentMethod === method.value;
          return (
            <div
              key={method.value}
              onClick={() => handleSelectPaymentMethod(method.value)}
              className={`relative flex items-center p-2 rounded-xl border-2 cursor-pointer transition-all duration-200 transform hover:scale-102 ${
                isSelected
                  ? `!border-${method.color}-700 bg-${method.color}-50 shadow-lg`
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
              } ${
                paymentLoading || qrCodeData
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 ${
                  isSelected
                    ? `text-${method.color}-500 bg-${method.color}`
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`font-medium ${
                  isSelected ? `text-${method.color}-700` : "text-gray-700"
                }`}
              >
                {method.label}
              </span>
              {isSelected && (
                <div
                  className={`absolute right-4 w-5 h-5 bg-${method.color}-500 rounded-full flex items-center justify-center`}
                >
                  <CheckCircle className={`w-3 h-3 text-white`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPaymentTabs = () => (
    <div className="mb-6">
      <div className="flex bg-gray-100 rounded-3xl p-2">
        {booking.paymentStatus !== "deposit_paid" &&
          booking.paymentStatus !== "fully_paid" &&
          depositAmountValue > 0 && (
            <button
              className={`flex-1 px-2 rounded-3xl text-sm font-medium transition-all duration-200 ${
                activePaymentTab === 0
                  ? "bg-white text-orange-600 border border-orange-600 shadow-md transform scale-105"
                  : "text-gray-600 hover:text-gray-800"
              } ${
                paymentLoading || qrCodeData
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() => handleTabChange(0)}
              disabled={paymentLoading || qrCodeData}
            >
              <div className="flex items-center justify-center">
                <Percent className="w-4 h-4 mr-2" />
                Thanh toán cọc (20%)
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatPrice(amountForDepositTab)}
              </div>
            </button>
          )}

        {booking.paymentStatus !== "fully_paid" && amountForFullTab > 0 && (
          <button
            className={`flex-1 px-2 rounded-3xl text-sm font-medium transition-all duration-200 ${
              activePaymentTab === 1
                ? "bg-white text-green-600 border border-green-600 shadow-md transform scale-105"
                : "text-gray-600 hover:text-gray-800"
            } ${
              paymentLoading || qrCodeData
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() => handleTabChange(1)}
            disabled={paymentLoading || qrCodeData}
          >
            <div className="flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              {booking.paymentStatus === "deposit_paid"
                ? "Thanh toán còn lại"
                : "Thanh toán toàn bộ"}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatPrice(amountForFullTab)}
            </div>
          </button>
        )}
      </div>
    </div>
  );

  const renderQRSection = () => {
    if (!qrCodeData && randomQR) {
      const { qrData, amount, bookingCode } = randomQR;
      const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        qrData
      )}`;
      return (
        <div className="space-y-6">
          {/* Nút trở lại */}
          <div className="flex justify-start mb-2">
            <button
              onClick={() => {
                setRandomQR(null);
              }}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded-lg border border-blue-100 bg-white shadow-sm transition-all"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Trở lại
            </button>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white mb-4">
              <QrCode className="w-12 h-12 mx-auto mb-3 text-white" />
              <h3 className="text-lg font-semibold mb-2">
                Mã QR ngẫu nhiên (Test)
              </h3>
              <p className="text-blue-100">
                Quét mã để test chức năng thanh toán
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl inline-block shadow border border-blue-100">
              <img
                src={qrImage}
                alt="Random QR Code"
                className="mx-auto"
                style={{ width: "180px", height: "180px" }}
              />
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-blue-100">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center">
                <Banknote className="w-4 h-4 mr-2" />
                Số tiền thanh toán
              </span>
              <span className="font-bold text-lg text-blue-600">
                {formatPrice(amount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Nội dung chuyển khoản
              </span>
              <span className="font-mono text-sm text-gray-900">
                {bookingCode}
              </span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 text-blue-800 text-center">
            Đây là mã QR ngẫu nhiên để test chức năng. Khi quét sẽ hiện số tiền
            và nội dung là mã booking.
          </div>
          <button
            onClick={handleBackToChooseMethod}
            className="mb-4 px-4 py-2 rounded-lg border border-blue-200 bg-white text-blue-700 hover:bg-blue-50 font-medium transition"
          >
            ← Chọn lại phương thức thanh toán
          </button>
        </div>
      );
    }

    // QR thành công khi fully_paid hoặc deposit_paid
    if (
      (qrCodeData &&
        (paymentStatus === "fully_paid" || paymentStatus === "deposit_paid")) ||
      (!qrCodeData &&
        (booking?.paymentStatus === "fully_paid" ||
          booking?.paymentStatus === "deposit_paid"))
    ) {
      // Lấy bookingCode và số tiền đã thanh toán
      const code = booking?.bookingCode || qrCodeData?.bookingCode || "";
      const paidAmount =
        booking?.paymentBreakdown?.totalPaid || qrCodeData?.amount || 0;
      const qrSuccessData = `PAID:${code}`;
      const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        qrSuccessData
      )}`;
      return (
        <div className="space-y-6">
          {/* Nút trở lại */}
          <div className="flex justify-start mb-2">
            <button
              onClick={() => {
                dispatch(clearQRCodeData());
                setRandomQR(null);
              }}
              className="flex items-center text-green-700 hover:text-green-900 font-medium px-3 py-1 rounded-lg border border-green-100 bg-white shadow-sm transition-all"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Trở lại
            </button>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-6 text-white mb-4">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-white" />
              <h3 className="text-lg font-semibold mb-2">
                Thanh toán thành công!
              </h3>
              <p className="text-green-100">
                Quét mã để xác nhận thanh toán thành công
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl inline-block shadow border border-green-200">
              <img
                src={qrImage}
                alt="QR Thành công"
                className="mx-auto"
                style={{ width: "180px", height: "180px" }}
              />
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center">
                <Banknote className="w-4 h-4 mr-2" />
                Số tiền đã thanh toán
              </span>
              <span className="font-bold text-lg text-green-600">
                {formatPrice(paidAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Mã booking
              </span>
              <span className="font-mono text-sm text-gray-900">{code}</span>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200 text-green-800 text-center">
            Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ.
          </div>
          {process.env.NODE_ENV === "development" &&
            qrCodeData?.transactionId && (
              <button
                onClick={handleSimulatePayment}
                className="mt-6 w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
              >
                🧪 Mô phỏng chuyển sang invoice
              </button>
            )}
        </div>
      );
    }

    if (!qrCodeData) return null;

    const {
      transactionId,
      transactionReference,
      amount,
      paymentMethod,
      bankInfo,
      paymentUrl,
      qrCodeUrl: momoQrUrl,
      deeplink,
    } = qrCodeData;

    let paymentContent;

    if (paymentMethod === "vnpay" && paymentUrl) {
      paymentContent = (
        <div className="text-center">
          <button
            onClick={handleBackToChooseMethod}
            className="mb-4 px-4 py-2 rounded-lg border border-blue-200 bg-white text-blue-700 hover:bg-blue-50 font-medium transition"
          >
            ← Chọn lại phương thức thanh toán
          </button>
          <div className="bg-cyan-50 border border-cyan-300 rounded-2xl p-3 text-cyan-700 mb-4">
            <CreditCard className="w-12 h-12 mx-auto " />
            <h3 className="text-lg font-semibold ">Thanh toán VNPay</h3>
            <p className="text-cyan-800 text-sm">
              Bạn sẽ được chuyển đến cổng thanh toán VNPay
            </p>
          </div>
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex  items-center bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Thanh toán ngay
            <ExternalLink className="w-5 h-5 ml-2" />
          </a>
        </div>
      );
    } else if (
      paymentMethod === "momo" &&
      (paymentUrl || momoQrUrl || deeplink)
    ) {
      let momoDisplay;
      if (momoQrUrl) {
        const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          momoQrUrl
        )}`;
        momoDisplay = (
          <div>
            <button
              onClick={handleBackToChooseMethod}
              className="mb-4 px-4 py-2 rounded-lg border border-blue-200 bg-white text-blue-700 hover:bg-blue-50 font-medium transition"
            >
              ← Chọn lại phương thức thanh toán
            </button>
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-3 text-white">
              <Smartphone className="w-8 h-8 mx-auto" />
              <h3 className="text-lg font-semibold mb-4">Quét mã MoMo</h3>
              <div className="bg-white p-4 rounded-xl">
                <img
                  src={qrImage}
                  alt="MoMo QR Code"
                  className="mx-auto"
                  style={{ width: "180px", height: "180px" }}
                />
              </div>
            </div>
          </div>
        );
      } else if (paymentUrl) {
        momoDisplay = (
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Thanh toán MoMo
            <ExternalLink className="w-5 h-5 ml-2" />
          </a>
        );
      }
      paymentContent = <div className="text-center">{momoDisplay}</div>;
    } else if (paymentMethod === "bank_transfer" && bankInfo && showBankInfo) {
      return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 relative">
          <button
            onClick={() => setShowBankInfo(false)}
            className="absolute top-2 right-2 text-green-600 hover:text-green-800"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={handleBackToChooseMethod}
            className="mb-4 px-4 py-2 rounded-lg border border-blue-200 bg-white text-blue-700 hover:bg-blue-50 font-medium transition"
          >
            ← Chọn lại phương thức thanh toán
          </button>
          <div className="text-center mb-4">
            <div className="mx-auto flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
              <Banknote className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-green-800 mb-2">
              Chờ xác nhận chuyển khoản
            </h3>
            <p className="text-sm text-green-700">
              Vui lòng chuyển khoản đúng thông tin bên dưới để hệ thống tự động
              xác nhận.
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-green-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ngân hàng:</span>
              <span className="font-semibold text-gray-900">
                {bankInfo.bankName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Số tài khoản:</span>
              <div className="flex items-center">
                <span className="font-mono text-base text-blue-700 font-bold mr-2">
                  {bankInfo.accountNumber}
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(bankInfo.accountNumber, "Số tài khoản")
                  }
                  className="text-green-600 hover:text-green-700 text-sm flex items-center"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  {copiedText === "Số tài khoản" ? "Đã copy!" : "Copy"}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Chủ tài khoản:</span>
              <span className="font-semibold text-gray-900">
                {bankInfo.accountName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Nội dung chuyển khoản:
              </span>
              <button
                onClick={() =>
                  copyToClipboard(bankInfo.transferContent, "Nội dung CK")
                }
                className="text-green-600 hover:text-green-700 text-sm flex items-center"
              >
                <Copy className="w-4 h-4 mr-1" />
                {copiedText === "Nội dung CK" ? "Đã copy!" : "Copy"}
              </button>
            </div>
            <p className="font-mono text-base text-orange-600 font-bold mt-1 text-right">
              {bankInfo.transferContent}
            </p>
            {qrCodeData?.expiredAt && (
              <div className="text-xs text-gray-500 mt-2">
                Hạn chuyển khoản:{" "}
                <span className="font-semibold">
                  {new Date(qrCodeData.expiredAt).toLocaleString("vi-VN")}
                </span>
              </div>
            )}
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 text-yellow-800 text-center mt-4">
            <Info className="w-5 h-5 inline mr-2" />
            Sau khi chuyển khoản, hệ thống sẽ tự động xác nhận trong vòng vài
            phút.
          </div>
          {/* Nút test chuyển trạng thái cho bank_transfer */}
          {process.env.NODE_ENV === "development" &&
            qrCodeData?.transactionId &&
            paymentStatus === "pending" && (
              <button
                onClick={async () => {
                  // Gọi trực tiếp API mô phỏng thanh toán, nhưng KHÔNG dispatch handlePaymentSuccess (không đóng modal, không chuyển invoice)
                  if (!qrCodeData?.transactionId) return;
                  console.log(
                    "Simulate with transactionId:",
                    qrCodeData.transactionId
                  ); // debug
                  const token = localStorage.getItem("token");
                  try {
                    await fetch(
                      `http://localhost:9999/api/v1/payments/transaction/${qrCodeData.transactionId}/simulate`,
                      {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    if (bookingIdFortransaction) {
                      dispatch(
                        fetchCustomerBookingDetail(bookingIdFortransaction)
                      );
                    }
                  } catch (err) {}
                }}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 mt-4"
              >
                🧪 Test chuyển trạng thái thành công
              </button>
            )}
          {/* Nút mô phỏng chuyển invoice khi đã đổi trạng thái */}
          {process.env.NODE_ENV === "development" &&
            qrCodeData?.transactionId &&
            (paymentStatus === "fully_paid" ||
              paymentStatus === "deposit_paid") && (
              <button
                onClick={handleSimulatePayment}
                className="mt-4 w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
              >
                🧪 Mô phỏng chuyển sang invoice
              </button>
            )}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {paymentContent}

        {/* Payment Status */}
        <div className="flex items-center justify-center">
          {isPolling && paymentStatus === "pending" && (
            <div className="flex items-center bg-orange-50 px-4 py-2 rounded-xl border border-orange-200">
              <Loader2 className="w-5 h-5 text-orange-500 animate-spin mr-3" />
              <span className="text-orange-700 font-medium">
                Đang kiểm tra thanh toán...
              </span>
            </div>
          )}
        </div>

        {/* Payment Info */}
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center">
              <Banknote className="w-4 h-4 mr-2" />
              Số tiền thanh toán
            </span>
            <span className="font-bold  rounded-xltext-lg text-blue-600">
              {formatPrice(amount)}
            </span>
          </div>
          <div className="flex items-center  justify-between">
            <span className="text-gray-600 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              Mã giao dịch
            </span>
            <div className="flex items-center">
              <span className="font-mono text-sm text-gray-900 mr-2">
                {transactionReference}
              </span>
              <button
                onClick={() => copyToClipboard(transactionReference, "Mã GD")}
                className="text-blue-600 hover:text-blue-700"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        {isPolling && paymentMethod !== "bank_transfer" && (
          <div className="bg-blue-50 rounded-xl px-4 py-2 border border-blue-200">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm mb-0 text-blue-800">
                Vui lòng không đóng cửa sổ này. Trạng thái thanh toán sẽ được
                cập nhật tự động.
              </p>
            </div>
          </div>
        )}

        {/* Test Button */}
        {process.env.NODE_ENV === "development" &&
          transactionId &&
          paymentStatus === "pending" && (
            <>
              <button
                onClick={async () => {
                  // Gọi trực tiếp API mô phỏng thanh toán, nhưng KHÔNG dispatch handlePaymentSuccess (không đóng modal, không chuyển invoice)
                  if (!qrCodeData?.transactionId) return;
                  console.log(
                    "Simulate with transactionId:",
                    qrCodeData.transactionId
                  ); // debug
                  const token = localStorage.getItem("token");
                  try {
                    await fetch(
                      `http://localhost:9999/api/v1/payments/transaction/${qrCodeData.transactionId}/simulate`,
                      {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    if (bookingIdFortransaction) {
                      dispatch(
                        fetchCustomerBookingDetail(bookingIdFortransaction)
                      );
                    }
                  } catch (err) {}
                }}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 mb-2"
              >
                🧪 Test đã thanh toán thành công
              </button>
            </>
          )}
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "bg-black/60 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div
        className={`transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-[1200px] w-full h-[700px] min-h-[500px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between py-3 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative">
            <div className="flex items-center gap-2">
              {/* Nút quay lại từng bước */}
              {currentStep > 1 && (
                <button
                  onClick={() => goToStep(currentStep - 1)}
                  className="flex items-center text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-2xl px-2 py-1 z-10"
                  style={{ minWidth: 0 }}
                >
                  <ArrowLeft size={24} />
                </button>
              )}
              {/* Hiển thị số bước xuất hiện dần */}
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((step) => (
                  <button
                    key={step}
                    onClick={() =>
                      step < currentStep ? goToStep(step) : undefined
                    }
                    disabled={step > currentStep}
                    className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-base transition-all duration-200
                      ${
                        currentStep === step
                          ? "bg-white text-blue-700 shadow"
                          : step < currentStep
                          ? "bg-blue-200 text-blue-700"
                          : "bg-blue-500 text-white opacity-50"
                      }
                      ${
                        step > currentStep
                          ? "cursor-default"
                          : "hover:bg-white/20"
                      }
                    `}
                    style={{
                      visibility: step <= currentStep ? "visible" : "hidden",
                    }}
                  >
                    {step}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 text-center">
              <h2 className="text-xl font-bold">Thanh toán booking</h2>
              <p className="text-blue-100 text-sm mt-1">
                Hoàn tất thanh toán để xác nhận đặt chỗ
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-blue-100 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-2xl"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content - Horizontal Layout */}
          <div className="flex gap-4 p-6 w-full flex-1 h-[50vh] overflow-y-auto">
            {/* Left: Booking Info (4/10) */}
            <div className="bg-gradient-to-br w-5/12 from-blue-50 to-indigo-50 rounded-2xl p-3 border border-blue-100 ">
              <div className="flex items-center justify-between pb-2">
                <span className="text-base justify-start  font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-1  text-blue-600" />
                  Thông tin booking
                </span>
                <span
                  className={`px-1 rounded-full justify-end bg-white border items-center border-gray-600 text-xs font-medium ${getPaymentStatusColor(
                    booking.paymentStatus
                  )}`}
                >
                  {getPaymentStatusText(booking.paymentStatus)}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 ">
                <div className="flex items-center justify-between py-2 border-b border-blue-100">
                  <span className="text-gray-600 flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    Mã booking
                  </span>
                  <span className="font-semibold text-gray-900">
                    {booking.bookingCode}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-blue-100">
                  <span className="text-gray-600 flex items-center">
                    <Banknote className="w-4 h-4 mr-2" />
                    Tổng tiền
                  </span>
                  <span className="font-bold text-lg text-blue-600">
                    {formatPrice(
                      booking.paymentBreakdown?.totalAmount ||
                        booking.amount ||
                        0
                    )}
                  </span>
                </div>

                {booking.paymentBreakdown?.totalPaid > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-blue-100">
                    <span className="text-gray-600 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Đã thanh toán
                    </span>
                    <span className="font-semibold text-green-600">
                      {formatPrice(booking.paymentBreakdown.totalPaid)}
                    </span>
                  </div>
                )}

                {booking.paymentBreakdown?.depositAmount > 0 &&
                  booking.paymentStatus !== "deposit_paid" &&
                  booking.paymentStatus !== "fully_paid" && (
                    <div className="flex items-center justify-between py-2 border-b border-blue-100">
                      <span className="text-gray-600 flex items-center">
                        <Percent className="w-4 h-4 mr-2" />
                        Tiền cọc
                      </span>
                      <span className="font-semibold text-orange-600">
                        {formatPrice(booking.paymentBreakdown.depositAmount)}
                      </span>
                    </div>
                  )}

                {booking.paymentStatus === "deposit_paid" &&
                  booking.paymentBreakdown?.remainingAmount > 0 && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600 flex items-center">
                        <Timer className="w-4 h-4 mr-2" />
                        Còn lại
                      </span>
                      <span className="font-semibold text-red-600">
                        {formatPrice(booking.paymentBreakdown.remainingAmount)}
                      </span>
                    </div>
                  )}

                <div className="flex items-center justify-between py-2 border-b border-blue-100">
                  <span className="text-gray-600 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Số khách
                  </span>
                  <span className="font-semibold text-gray-900">
                    {totalGuests} khách
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    Số phòng đặt
                  </span>
                  <span className="font-semibold text-gray-900">
                    {totalRooms} phòng
                  </span>
                </div>
                {bookedRooms.length > 0 && (
                  <div className="py-1 border-b border-blue-100">
                    <ul className="text-gray-700 pt-0 list-disc ml-3">
                      {bookedRooms.map((room, idx) => (
                        <li key={room._id || idx}>
                          {room.roomId?.name || room.name || "Phòng"} x{" "}
                          {room.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Dịch vụ */}
                {bookedServices.length > 0 && (
                  <div className="py-1 border-b border-blue-100">
                    <span className="text-gray-600 flex items-center">
                      <Info className="w-4 h-4 mr-2" />
                      Dịch vụ đã chọn
                    </span>
                    <ul className="text-sm text-gray-700 list-disc pt-0 ml-3">
                      {bookedServices.map((service, idx) => (
                        <li key={service.serviceId || service._id || idx}>
                          {service.serviceName || service.name || "Dịch vụ"}
                          {service.serviceQuantity || service.quantity
                            ? ` x ${
                                service.serviceQuantity || service.quantity
                              }`
                            : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Ngày đặt */}
                <div className="flex items-center justify-between py-2 border-b border-blue-100">
                  <span className="text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Ngày đặt
                  </span>
                  <span className="font-semibold text-gray-900">
                    {booking.checkInDate
                      ? new Date(booking.checkInDate).toLocaleDateString(
                          "vi-VN"
                        )
                      : booking.createdAt
                      ? new Date(booking.createdAt).toLocaleDateString("vi-VN")
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
            {/* Right: Payment Section (6/10) */}
            <div
              className="w-7/12 md:w-6/12 flex flex-col "
              style={{ flexBasis: "60%" }}
            >
              {booking.paymentStatus === "fully_paid" ? (
                <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                  <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Thanh toán hoàn tất!
                  </h3>
                  <p className="text-green-700">
                    Booking này đã được thanh toán đầy đủ.
                  </p>
                  {process.env.NODE_ENV === "development" &&
                    qrCodeData?.transactionId && (
                      <button
                        onClick={handleSimulatePayment}
                        className="mt-6 w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                      >
                        🧪 Mô phỏng chuyển sang invoice
                      </button>
                    )}
                </div>
              ) : booking.paymentStatus === "deposit_paid" ? (
                <div className="text-center p-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                  <div className="mx-auto flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    Đã đặt cọc thành công!
                  </h3>
                  <p className="text-yellow-700">
                    Bạn đã thanh toán tiền cọc. Vui lòng thanh toán phần còn lại
                    trước hạn.
                  </p>
                  {process.env.NODE_ENV === "development" &&
                    qrCodeData?.transactionId && (
                      <button
                        onClick={handleSimulatePayment}
                        className="mt-6 w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                      >
                        🧪 Mô phỏng chuyển sang invoice
                      </button>
                    )}
                </div>
              ) : !qrCodeData ? (
                <>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-900 pb-2">
                      Chọn phương thức thanh toán
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        {
                          value: "bank_transfer",
                          label: "Chuyển khoản ngân hàng",
                          icon: Banknote,
                          color: "blue",
                        },
                        {
                          value: "vnpay",
                          label: "VNPay",
                          icon: CreditCard,
                          color: "cyan",
                        },
                        {
                          value: "momo",
                          label: "MoMo",
                          icon: Smartphone,
                          color: "red",
                        },
                      ].map((method) => {
                        const Icon = method.icon;
                        const isSelected =
                          selectedPaymentMethod === method.value;
                        return (
                          <div
                            key={method.value}
                            onClick={() =>
                              handleSelectPaymentMethod(method.value)
                            }
                            className={`relative flex items-center p-2 rounded-xl border-2 cursor-pointer transition-all duration-200 transform hover:scale-102 ${
                              isSelected
                                ? `!border-${method.color}-700 bg-${method.color}-50 shadow-lg`
                                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                            } ${
                              paymentLoading || qrCodeData
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <div
                              className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 ${
                                isSelected
                                  ? `text-${method.color}-500 bg-${method.color}`
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <span
                              className={`font-medium ${
                                isSelected
                                  ? `text-${method.color}-700`
                                  : "text-gray-700"
                              }`}
                            >
                              {method.label}
                            </span>
                            {isSelected && (
                              <div
                                className={`absolute right-4 w-5 h-5 bg-${method.color}-500 rounded-full flex items-center justify-center`}
                              >
                                <CheckCircle className={`w-3 h-3 text-white`} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* payment Tabs */}
                  <div className="my-2">
                    <div className="flex bg-gray-100 rounded-3xl p-2">
                      {booking.paymentStatus !== "deposit_paid" &&
                        booking.paymentStatus !== "fully_paid" &&
                        depositAmountValue > 0 && (
                          <button
                            className={`flex-1 px-2 rounded-3xl text-sm font-medium transition-all duration-200 ${
                              activePaymentTab === 0
                                ? "bg-white text-orange-600 border border-orange-600 shadow-md transform scale-105"
                                : "text-gray-600 hover:text-gray-800"
                            } ${
                              paymentLoading || qrCodeData
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => handleTabChange(0)}
                            disabled={paymentLoading || qrCodeData}
                          >
                            <div className="flex items-center text-[13px] justify-center">
                              <Percent className="w-4 h-4 mr-1" />
                              Thanh toán cọc (20%)
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatPrice(depositAmountValue)}
                            </div>
                          </button>
                        )}

                      {booking.paymentStatus !== "fully_paid" &&
                        amountForFullTab > 0 && (
                          <button
                            className={`flex-1 px-2 rounded-3xl font-medium transition-all duration-200 ${
                              activePaymentTab === 1
                                ? "bg-white text-green-600 border border-green-600 shadow-md transform scale-105"
                                : "text-gray-600 hover:text-gray-800"
                            } ${
                              paymentLoading || qrCodeData
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => handleTabChange(1)}
                            disabled={paymentLoading || qrCodeData}
                          >
                            <div className="flex items-center text-[13px] justify-center">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {booking.paymentStatus === "deposit_paid"
                                ? "Thanh toán còn lại"
                                : "Thanh toán toàn bộ"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatPrice(amountForFullTab)}
                            </div>
                          </button>
                        )}
                    </div>
                  </div>

                  {/* Payment Buttons */}
                  <div className="space-y-3">
                    {activePaymentTab === 0 &&
                      booking.paymentStatus !== "deposit_paid" &&
                      booking.paymentStatus !== "fully_paid" &&
                      depositAmountValue > 0 && (
                        <button
                          onClick={handleDepositPayment}
                          disabled={paymentLoading}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
                        >
                          {paymentLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Đang xử lý...
                            </>
                          ) : (
                            <>
                              {getPaymentMethodIcon(selectedPaymentMethod)}
                              <span className="ml-2">
                                Thanh toán cọc (20%) -{" "}
                                {formatPrice(amountForDepositTab)}
                              </span>
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                          )}
                        </button>
                      )}

                    {activePaymentTab === 1 &&
                      booking.paymentStatus !== "fully_paid" &&
                      amountForFullTab > 0 && (
                        <button
                          onClick={handleFullOrRemainingPayment}
                          disabled={paymentLoading}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
                        >
                          {paymentLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Đang xử lý...
                            </>
                          ) : (
                            <>
                              {getPaymentMethodIcon(selectedPaymentMethod)}
                              <span className="ml-2">
                                {booking.paymentStatus === "deposit_paid"
                                  ? `Thanh toán còn lại - ${formatPrice(
                                      amountForFullTab
                                    )}`
                                  : `Thanh toán toàn bộ - ${formatPrice(
                                      amountForFullTab
                                    )}`}
                              </span>
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                          )}
                        </button>
                      )}
                  </div>
                </>
              ) : (
                renderQRSection()
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
