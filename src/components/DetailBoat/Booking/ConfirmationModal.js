import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  X,
  Check,
  AlertCircle,
  User,
  Mail,
  Phone,
  Users,
  Calendar,
  Home,
  MessageSquare,
  DollarSign,
} from "lucide-react";
import { confirmBooking, rejectBooking } from "../../../redux/asyncActions";
import { formatPrice } from "../../../redux/validation";

import Swal from "sweetalert2";
import {
  closeConfirmationModal,
  openTransactionModal,
} from "../../../redux/action";

const ConfirmationModal = () => {
  const dispatch = useDispatch();
  const { showConfirmationModal, confirmationData } = useSelector(
    (state) => state.ui.modals
  );
  const { submitting } = useSelector((state) => state.booking);

  if (!showConfirmationModal || !confirmationData) return null;

  const handleConfirm = async () => {
    const bookingId = confirmationData?.bookingId;
    const scheduleId = confirmationData?.scheduleId;

    if (!bookingId || !scheduleId) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: `Thiếu thông tin: ${!bookingId ? "bookingId" : "scheduleId"}.`,
        confirmButtonText: "OK",
      });
      return;
    }

    const result = await dispatch(confirmBooking({ bookingId, scheduleId }));

    if (result.success) {
      // Đóng confirmation modal trước
      dispatch(closeConfirmationModal());

      // Đợi một chút rồi mở transaction modal
      setTimeout(() => {
        dispatch(openTransactionModal(bookingId));
      }, 100);

      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Booking đã được xác nhận. Vui lòng tiến hành thanh toán.",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Lỗi xác nhận!",
        text: result.error,
        confirmButtonText: "Thử lại",
      });
    }
  };

  const handleReject = async () => {
    const bookingId =
      confirmationData?._id ||
      confirmationData?.bookingId ||
      confirmationData?.id ||
      confirmationData?.data?.bookingId ||
      confirmationData?.data?._id;

    if (!bookingId) {
      dispatch(closeConfirmationModal());
      Swal.fire({
        icon: "info",
        title: "Đã hủy",
        text: "Thao tác đã được hủy.",
        timer: 1500,
      });
      return;
    }

    const result = await dispatch(rejectBooking(bookingId));
    if (result.success) {
      // Modal sẽ tự động close trong rejectBooking action
    }
  };
  return (
    <div className="fixed pt-24 inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-8 py-5 text-white relative">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold mb-1">
                Xác nhận thông tin đặt phòng
              </h3>
              <p className="text-gray-50 text-sm">
                Vui lòng kiểm tra kỹ thông tin trước khi xác nhận
              </p>
            </div>
            <button
              onClick={handleReject}
              className="text-white hover:text-blue-200 transition-colors duration-200 p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
              disabled={submitting}
            >
              <X size={24} />
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(80vh-200px)]">
          {/* Alert */}
          <div className="bg-gradient-to-r from-amber-100 to-orange-50 border-l-4 border-amber-500 rounded-lg p-3 mb-8">
            <div className="flex items-center">
              <AlertCircle
                className="text-amber-600 mr-3 flex-shrink-0"
                size={20}
              />
              <span className="font-medium text-amber-800">
                Thông tin này sẽ được sử dụng để xử lý đặt phòng của bạn
              </span>
            </div>
          </div>

          {/* Form Grid 2x2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center border-b pb-2">
                <User className="mr-2 text-cyan-700" size={20} />
                Thông tin cá nhân
              </h4>

              <div className="space-y-4">
                <div className="bg-gray-100 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                  <label className="text-sm font-medium text-cyan-600 flex items-center mb-2">
                    <User size={16} className="mr-1 text-cyan-700" />
                    Họ và tên
                  </label>
                  <p className="text-gray-800 font-medium text-lg">
                    {confirmationData.fullName}
                  </p>
                </div>

                <div className="bg-gray-100 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <label className="text-sm font-medium text-cyan-600 flex items-center mb-2">
                    <Mail size={16} className="mr-2 text-cyan-700" />
                    Email
                  </label>
                  <p className="text-gray-800 font-medium">
                    {confirmationData.email}
                  </p>
                </div>

                <div className="bg-gray-100 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <label className="text-sm font-medium text-cyan-600 flex items-center mb-2">
                    <Phone size={16} className="mr-2 text-cyan-700" />
                    Số điện thoại
                  </label>
                  <p className="text-gray-800 font-medium">
                    {confirmationData.phoneNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center border-b pb-2">
                <Calendar className="mr-2 text-cyan-600" size={20} />
                Thông tin đặt phòng
              </h4>

              <div className="space-y-4">
                <div className="bg-gray-100 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                  <label className="text-sm font-medium text-cyan-600 flex items-center mb-2">
                    <Users size={16} className="mr-2 text-cyan-700" />
                    Số khách
                  </label>
                  <p className="text-gray-800 font-medium text-lg">
                    {confirmationData.guestCount} khách
                  </p>
                </div>

                <div className="bg-gray-100 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <label className="text-sm font-medium text-cyan-600 flex items-center mb-2">
                    <Calendar size={16} className="mr-2 text-cyan-700" />
                    Ngày check-in
                  </label>
                  <p className="text-gray-800 font-medium">
                    {new Date(confirmationData.checkInDate).toLocaleDateString(
                      "vi-VN",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>

                {confirmationData.selectedRooms &&
                  confirmationData.selectedRooms.length > 0 && (
                    <div className="bg-gray-100 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <label className="text-sm font-medium text-cyan-600 flex items-center mb-2">
                        <Home size={16} className="mr-2 text-cyan-700" />
                        Phòng đã chọn
                      </label>
                      <div className="space-y-2">
                        {confirmationData.selectedRooms.map((room, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center bg-white rounded-md p-2"
                          >
                            <span className="font-medium">
                              {room.name} × {room.quantity}
                            </span>
                            <span className="text-cyan-600 font-semibold">
                              {formatPrice(room.price * room.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Special Requirements */}
          {confirmationData.requirements && (
            <div className="mb-8">
              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                <label className="text-sm font-medium  text-cyan-600 flex items-center mb-3">
                  <MessageSquare size={16} className="mr-2 text-cyan-700" />
                  Yêu cầu đặc biệt
                </label>
                <p className="text-gray-800 leading-relaxed">
                  <li>{confirmationData.requirements}</li>
                </p>
              </div>
            </div>
          )}

          {/* Total Price */}
          <div className="bg-gradient-to-r from-cyan-100 to-cyan-50 border border-cyan-200 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <DollarSign className="text-cyan-600 mr-2" size={24} />
                <span className="text-xl font-bold text-gray-800">
                  Tổng tiền thanh toán:
                </span>
              </div>
              <span className="text-3xl font-bold text-cyan-600">
                {formatPrice(confirmationData.totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-8 py-4 border-t">
          <div className="flex gap-4">
            <button
              onClick={handleReject}
              disabled={submitting}
              className="flex-1 px-6 items-center py-3 border-2 border-red-300 text-red-700 rounded-xl hover:bg-red-100 hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 transform hover:scale-105"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-xl hover:from-cyan-500 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <Check size={20} className="mr-2" />
                  Xác nhận đặt phòng
                </>
              )}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
              <div className="absolute bottom-16 left-50 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
