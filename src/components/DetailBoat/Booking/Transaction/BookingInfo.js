import React from "react";
import {
  Calendar,
  Building,
  Banknote,
  CheckCircle,
  Percent,
  Timer,
  Users,
} from "lucide-react";

const BookingInfo = ({
  booking,
  confirmationData,
  bookedRooms,
  totalRooms,
  totalGuests,
  formatPrice,
  getPaymentStatusColor,
  getPaymentStatusText,
}) => (
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
          {formatPrice(
            booking.paymentBreakdown?.totalAmount || booking.amount || 0
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
        <span className="font-semibold text-gray-900">{totalGuests} khách</span>
      </div>
      <div className="flex items-center justify-between py-2 border-b border-blue-100">
        <span className="text-gray-600 flex items-center">
          <Building className="w-4 h-4 mr-2" />
          Số phòng đặt
        </span>
        <span className="font-semibold text-gray-900">{totalRooms} phòng</span>
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
    </div>
  </div>
);

export default BookingInfo;
