import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  X,
  CreditCard,
  Percent,
  QrCode,
  Clock,
  CheckCircle,
  Info,
  Banknote,
  Smartphone,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
  Copy,
  ExternalLink,
  Star,
  Building,
  Timer,
} from "lucide-react";
import {
  createDepositPayment,
  createFullPayment,
  simulatePaymentSuccess,
  fetchCustomerBookingDetail,
  stopPaymentStatusPolling,
  fetchInvoiceByBooking,
  fetchInvoiceByTransactionId,
} from "../../../redux/asyncActions";
import { formatPrice } from "../../../redux/validation";
import {
  setActivePaymentTab,
  closeTransactionModal,
  clearQRCodeData,
} from "../../../redux/action";

const TransactionModal = () => {
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

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("bank_transfer");
  const [isVisible, setIsVisible] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  useEffect(() => {
    if (showTransactionModal) {
      setIsVisible(true);
      if (bookingIdFortransaction) {
        console.log(
          "TransactionModal: Fetching booking detail for ID:",
          bookingIdFortransaction
        );
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
      dispatch(closeTransactionModal());
      dispatch(clearQRCodeData());
      // Lấy transactionId từ qrCodeData nếu có
      const transactionId = qrCodeData?.transactionId;
      if (transactionId) {
        dispatch(fetchInvoiceByTransactionId(transactionId));
      }
    }
  }, [paymentStatus, showTransactionModal]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      dispatch(closeTransactionModal());
      dispatch(clearQRCodeData());
      if (isPolling) {
        dispatch(stopPaymentStatusPolling());
      }
    }, 300);
  };

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(""), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  if (!showTransactionModal) return null;

  // Error State
  if (bookingError) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
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
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
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

  const handleTabChange = (tabIndex) => {
    if (!paymentLoading && !qrCodeData) {
      dispatch(setActivePaymentTab(tabIndex));
    }
  };

  const handleSimulatePayment = () => {
    if (qrCodeData?.transactionId) {
      dispatch(simulatePaymentSuccess(qrCodeData.transactionId));
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
        return "Đã thanh toán đầy đủ";
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
        <h3 className="text-base font-semibold text-gray-900 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
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
              onClick={() =>
                !paymentLoading &&
                !qrCodeData &&
                setSelectedPaymentMethod(method.value)
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
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white mb-4">
            <CreditCard className="w-12 h-12 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Thanh toán VNPay</h3>
            <p className="text-blue-100">
              Bạn sẽ được chuyển đến cổng thanh toán VNPay
            </p>
          </div>
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
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
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white">
            <Smartphone className="w-8 h-8 mx-auto mb-3" />
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
    } else if (paymentMethod === "bank_transfer" && bankInfo) {
      paymentContent = (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div className="text-center mb-4">
            <div className="mx-auto flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
              <Banknote className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-green-800 mb-2">
              Chờ xác nhận chuyển khoản
            </h3>
            <p className="text-sm text-green-700">
              Chúng tôi sẽ xác nhận thanh toán của bạn sớm nhất
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-green-200">
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
            <p className="font-mono text-sm font-semibold text-gray-900 mt-1">
              {bankInfo.transferContent}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {paymentContent}

        {/* Payment Status */}
        <div className="flex items-center justify-center">
          {isPolling && paymentStatus === "pending" && (
            <div className="flex items-center bg-orange-50 px-4 py-3 rounded-xl border border-orange-200">
              <Loader2 className="w-5 h-5 text-orange-500 animate-spin mr-3" />
              <span className="text-orange-700 font-medium">
                Đang kiểm tra thanh toán...
              </span>
            </div>
          )}
        </div>

        {/* Payment Info */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
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
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                Vui lòng không đóng cửa sổ này. Trạng thái thanh toán sẽ được
                cập nhật tự động.
              </p>
            </div>
          </div>
        )}

        {/* Test Button */}
        {process.env.NODE_ENV === "development" &&
          transactionId &&
          paymentStatus === "pending" &&
          paymentMethod !== "bank_transfer" && (
            <button
              onClick={handleSimulatePayment}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
            >
              🧪 Mô phỏng thanh toán thành công (Test)
            </button>
          )}
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "bg-black/60 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div
        className={`transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[70vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between py-3 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div>
              <h2 className="text-xl font-bold">Thanh toán booking</h2>
              <p className="text-blue-100 text-sm mt-1">
                Hoàn tất thanh toán để xác nhận đặt chỗ
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-blue-100 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content - Horizontal Layout */}
          <div className="flex flex-row gap-4 p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {/* Left: Booking Info */}
            <div className="w-full md:w-2/5 flex-shrink-0">
              {renderBookingInfo()}
            </div>
            {/* Right: Payment Section */}
            <div className="w-full md:w-3/5 flex flex-col justify-between">
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
                </div>
              ) : !qrCodeData ? (
                <>
                  {renderPaymentMethods()}
                  {renderPaymentTabs()}
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
