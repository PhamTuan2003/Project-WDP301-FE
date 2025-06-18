import React from "react";
import { Banknote, CreditCard, Smartphone, CheckCircle } from "lucide-react";

const PaymentMethods = ({
  selectedPaymentMethod,
  handleSelectPaymentMethod,
  paymentLoading,
  qrCodeData,
}) => (
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

export default PaymentMethods;
