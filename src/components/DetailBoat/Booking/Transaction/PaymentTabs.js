import React from "react";
import { Percent, CheckCircle } from "lucide-react";

const PaymentTabs = ({
  booking,
  depositAmountValue,
  amountForFullTab,
  activePaymentTab,
  paymentLoading,
  qrCodeData,
  handleTabChange,
  formatPrice,
}) => (
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
              {formatPrice(depositAmountValue)}
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
            paymentLoading || qrCodeData ? "opacity-50 cursor-not-allowed" : ""
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

export default PaymentTabs;
