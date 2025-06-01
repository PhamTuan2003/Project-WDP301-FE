import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  X,
  CreditCard,
  Percent,
  QrCode,
  Clock,
  CheckCircle,
  Info,
  AlertCircle,
} from "lucide-react";
import {
  createDepositPayment,
  createFullPayment,
  simulatePaymentSuccess,
} from "../../../redux/asyncActions";
import { formatPrice } from "../../../redux/validation";
import {
  setActivePaymentTab,
  closeTransactionModal,
} from "../../../redux/action";

const TransactionModal = () => {
  const dispatch = useDispatch();
  const { showTransactionModal } = useSelector((state) => state.ui.modals);
  const { activePaymentTab } = useSelector((state) => state.ui);
  const { currentBookingDetail } = useSelector((state) => state.booking);
  const { qrCodeData, paymentStatus, loading, isPolling } = useSelector(
    (state) => state.payment
  );

  // ✅ Tất cả hooks trước early return
  useEffect(() => {
    console.log("TransactionModal mounted:", {
      showTransactionModal,
      hasBookingDetail: !!currentBookingDetail?.booking,
      hasQRData: !!qrCodeData,
      paymentStatus,
      activeTab: activePaymentTab,
    });
  }, [
    showTransactionModal,
    currentBookingDetail,
    qrCodeData,
    paymentStatus,
    activePaymentTab,
  ]);

  // Early return với proper null check
  if (!showTransactionModal) return null;

  // Loading state nếu chưa có booking detail
  if (!currentBookingDetail?.booking) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Đang tải thông tin booking...</span>
          </div>
        </div>
      </div>
    );
  }

  const booking = currentBookingDetail.booking;
  const bookingId = booking._id;
  const totalAmount = booking.amount || 0;
  const depositAmount = Math.round(totalAmount * 0.2);

  // Handler functions
  const handleDepositPayment = async () => {
    console.log("Creating deposit payment for booking:", bookingId);
    try {
      const result = await dispatch(createDepositPayment(bookingId));
      console.log("Deposit payment result:", result);

      if (!result.success) {
        console.error("Deposit payment failed:", result.error);
      }
    } catch (error) {
      console.error("Error in deposit payment:", error);
    }
  };

  const handleFullPayment = async () => {
    console.log("Creating full payment for booking:", bookingId);
    try {
      const result = await dispatch(createFullPayment(bookingId));
      console.log("Full payment result:", result);

      if (!result.success) {
        console.error("Full payment failed:", result.error);
      }
    } catch (error) {
      console.error("Error in full payment:", error);
    }
  };

  const handleTabChange = (tabIndex) => {
    // Chỉ cho phép đổi tab khi không loading và chưa có QR
    if (!loading && !qrCodeData) {
      console.log("Switching to tab:", tabIndex);
      dispatch(setActivePaymentTab(tabIndex));
    }
  };

  const handleCloseModal = () => {
    console.log("Closing transaction modal");
    dispatch(closeTransactionModal());
  };

  const handleSimulatePayment = () => {
    if (qrCodeData?.transaction?._id) {
      console.log(
        "Simulating payment for transaction:",
        qrCodeData.transaction._id
      );
      dispatch(simulatePaymentSuccess(qrCodeData.transaction._id));
    }
  };

  // Render QR Code section
  const renderQRSection = () => {
    if (!qrCodeData) return null;

    const { transaction, qrContent, bankInfo } = qrCodeData;
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      qrContent
    )}`;

    return (
      <div className="qr-payment-section">
        <div className="text-center mb-4">
          <QrCode className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-800">
            Quét mã QR để thanh toán
          </h3>
        </div>

        {/* QR Code Display */}
        <div className="qr-container bg-white p-4 rounded-lg shadow-sm border-2 border-gray-200 text-center mb-4">
          <img
            src={qrImageUrl}
            alt="QR Code thanh toán"
            className="qr-image mx-auto mb-3"
            style={{ width: "200px", height: "200px" }}
          />

          {/* Payment Status */}
          <div className="flex items-center justify-center mb-2">
            {paymentStatus === "pending" && (
              <>
                <Clock className="w-4 h-4 text-orange-500 mr-2" />
                <span className="text-orange-600 font-medium">
                  Đang chờ thanh toán...
                </span>
              </>
            )}
            {paymentStatus === "completed" && (
              <>
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-green-600 font-medium">
                  Thanh toán thành công!
                </span>
              </>
            )}
          </div>
        </div>

        {/* Payment Info */}
        <div className="payment-info bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Số tiền:</span>
              <div className="font-semibold text-blue-600">
                {formatPrice(transaction.amount)}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Mã giao dịch:</span>
              <div className="font-mono text-xs font-medium">
                {transaction.transactionCode}
              </div>
            </div>
          </div>

          {bankInfo && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-600 mb-2">
                Thông tin chuyển khoản:
              </div>
              <div className="text-sm">
                <div>
                  <strong>Ngân hàng:</strong> {bankInfo.bankName}
                </div>
                <div>
                  <strong>STK:</strong> {bankInfo.accountNumber}
                </div>
                <div>
                  <strong>Chủ TK:</strong> {bankInfo.accountName}
                </div>
                <div>
                  <strong>Nội dung:</strong> {bankInfo.transferContent}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="payment-instructions">
          <div className="flex items-start text-sm text-gray-600 mb-2">
            <Info className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
            <span>Vui lòng quét mã QR bằng ứng dụng ngân hàng</span>
          </div>
          <div className="flex items-start text-sm text-gray-600 mb-2">
            <Info className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
            <span>Thanh toán sẽ được xác nhận tự động</span>
          </div>
          <div className="flex items-start text-sm text-gray-600 mb-4">
            <Info className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
            <span>Hóa đơn sẽ được tạo sau khi thanh toán thành công</span>
          </div>
        </div>

        {/* Test Button - Only in development */}
        {process.env.NODE_ENV === "development" && (
          <button
            onClick={handleSimulatePayment}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition-colors mb-4"
          >
            Mô phỏng thanh toán thành công (Test)
          </button>
        )}
      </div>
    );
  };

  // Main render
  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="modal-content bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Thanh toán booking
          </h2>
          <button
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Booking Info */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="text-sm text-blue-800">
              <div>
                <strong>Booking ID:</strong> {bookingId}
              </div>
              <div>
                <strong>Tổng tiền:</strong> {formatPrice(totalAmount)}
              </div>
              <div>
                <strong>Khách hàng:</strong>{" "}
                {booking.customer?.fullName || "N/A"}
              </div>
            </div>
          </div>

          {!qrCodeData ? (
            <>
              {/* Tab Navigation */}
              <div className="tab-navigation flex mb-6 bg-gray-100 rounded-lg p-1">
                <button
                  className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                    activePaymentTab === 0
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  } ${
                    loading || qrCodeData ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => handleTabChange(0)}
                  disabled={loading || qrCodeData}
                >
                  <Percent className="w-4 h-4 inline mr-2" />
                  Đặt cọc 20% ({formatPrice(depositAmount)})
                </button>
                <button
                  className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                    activePaymentTab === 1
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  } ${
                    loading || qrCodeData ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => handleTabChange(1)}
                  disabled={loading || qrCodeData}
                >
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  Thanh toán full ({formatPrice(totalAmount)})
                </button>
              </div>

              {/* Payment Content */}
              <div className="payment-actions">
                {activePaymentTab === 0 ? (
                  <div className="text-center">
                    <div className="bg-orange-50 p-4 rounded-lg mb-4">
                      <h3 className="font-semibold text-orange-800 mb-2">
                        Thanh toán cọc 20%
                      </h3>
                      <p className="text-sm text-orange-700">
                        Sau khi thanh toán cọc, bạn có thể thanh toán phần còn
                        lại khi check-in
                      </p>
                    </div>
                    <button
                      onClick={handleDepositPayment}
                      disabled={loading}
                      className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Đang tạo QR code...
                        </>
                      ) : (
                        <>
                          <QrCode className="w-4 h-4 mr-2" />
                          Tạo thanh toán đặt cọc
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <h3 className="font-semibold text-green-800 mb-2">
                        Thanh toán đầy đủ
                      </h3>
                      <p className="text-sm text-green-700">
                        Thanh toán toàn bộ số tiền ngay bây giờ
                      </p>
                    </div>
                    <button
                      onClick={handleFullPayment}
                      disabled={loading}
                      className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Đang tạo QR code...
                        </>
                      ) : (
                        <>
                          <QrCode className="w-4 h-4 mr-2" />
                          Tạo thanh toán full
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            renderQRSection()
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={handleCloseModal}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
