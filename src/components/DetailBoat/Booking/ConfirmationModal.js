import React, { useState } from "react";
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
  ArrowLeft,
} from "lucide-react";
import {
  customerCancelBooking,
  customerConfirmConsultation,
} from "../../../redux/asyncActions";
import { formatPrice } from "../../../redux/validation";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import {
  closeConfirmationModal,
  openTransactionModal,
} from "../../../redux/actions";

// Animation variants for modal drop-in and backdrop fade
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};
const dropInVariants = {
  hidden: { y: "-100vh", opacity: 0, scale: 0.8 },
  visible: {
    y: "0",
    opacity: 1,
    scale: 1,
    transition: { type: "spring", damping: 20, stiffness: 300 },
  },
  exit: { y: "100vh", opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const ConfirmationModal = ({ onBack }) => {
  const dispatch = useDispatch();
  const { showConfirmationModal, confirmationData } = useSelector(
    (state) => state.ui.modals
  );
  const { submitting } = useSelector((state) => state.booking);
  const [showSuccess, setShowSuccess] = useState(false);
  if (!showConfirmationModal || !confirmationData) return null;
  const { bookingId, isDirectBooking } = confirmationData;

  // Tính lại tổng khách thực tế nếu có adults, children
  const adults = Number(
    confirmationData.adults ?? confirmationData.guestCounter?.adults ?? 1
  );
  const childrenUnder10 = Number(
    confirmationData.childrenUnder10 ??
      confirmationData.guestCounter?.childrenUnder10 ??
      0
  );
  const childrenAbove10 = Number(
    confirmationData.childrenAbove10 ??
      confirmationData.guestCounter?.childrenAbove10 ??
      0
  );
  const totalGuests = adults + childrenUnder10 + Math.ceil(childrenAbove10 / 2);

  const handleProceedToPayment = () => {
    if (!bookingId) {
      Swal.fire({
        icon: "error",
        title: "Thiếu booking ID",
        confirmButtonColor: "#3085d6",
      });
      return;
    }
    setShowSuccess(true);
    setTimeout(() => {
      dispatch(closeConfirmationModal());
      dispatch(openTransactionModal(bookingId));
      setShowSuccess(false);
    }, 1500);
  };

  const handleConfirmAfterConsultation = async () => {
    if (!bookingId) {
      Swal.fire("Lỗi!", "Thiếu bookingId để xác nhận.", "error");
      return;
    }
    setShowSuccess(true);
    await dispatch(customerConfirmConsultation(bookingId));
    setTimeout(() => {
      dispatch(closeConfirmationModal());
      setShowSuccess(false);
    }, 1500);
  };

  const handleCancelOrReject = async () => {
    if (!bookingId) {
      dispatch(closeConfirmationModal());
      Swal.fire({ icon: "info", title: "Đã hủy", timer: 1500 });
      return;
    }
    await dispatch(customerCancelBooking(bookingId));
  };

  const handleBack = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (typeof onBack === "function") {
      onBack();
    } else {
      dispatch(closeConfirmationModal());
    }
  };

  const confirmAction = isDirectBooking
    ? handleProceedToPayment
    : handleConfirmAfterConsultation;
  const confirmText = isDirectBooking
    ? "Tiến hành thanh toán"
    : "Xác nhận & Thanh toán";

  return (
    <AnimatePresence>
      {showConfirmationModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          }}
        >
          {/* Nút Quay lại */}

          {showSuccess && (
            <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-2xl shadow-2xl px-12 py-10 flex flex-col items-center">
                <Check className="w-16 h-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-green-700 mb-2">
                  Thành công!
                </h2>
                <p className="text-green-700 text-lg">
                  Đặt phòng của bạn đã được xác nhận.
                </p>
              </div>
            </div>
          )}
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
            variants={dropInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-8 py-5 text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start">
                  {" "}
                  <button
                    onClick={handleBack}
                    type="button"
                    className="text-white hover:text-blue-200 transition-colors duration-200 p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
                    style={{ minWidth: 0 }}
                  >
                    <ArrowLeft size={24} /> 2/3
                  </button>
                </div>
                <div className=" items-center justify-center">
                  <h3 className="text-2xl font-bold mb-1">
                    Xác nhận thông tin đặt phòng
                  </h3>
                  <p className="text-gray-50 text-sm">
                    Vui lòng kiểm tra kỹ thông tin trước khi xác nhận
                  </p>
                </div>
                <div className="flex items-center justify-end">
                  {" "}
                  <button
                    onClick={handleCancelOrReject}
                    className="text-white hover:text-blue-200 transition-colors duration-200 p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
                    disabled={submitting}
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto max-h-[calc(80vh-200px)]">
              <div className="bg-gradient-to-r from-amber-100 to-orange-50 border-l-4 border-amber-500 rounded-lg p-3 mb-8">
                <div className="flex items-center">
                  <AlertCircle className="text-amber-600 mr-3" size={20} />
                  <span className="font-medium text-amber-800">
                    Thông tin này sẽ được sử dụng để xử lý đặt phòng của bạn
                  </span>
                </div>
              </div>
              {/* Grid: Personal & Booking Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Personal Info */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center border-b pb-2">
                    <User className="mr-2 text-cyan-700" size={20} />
                    Thông tin cá nhân
                  </h4>
                  <div className="space-y-4">
                    {[
                      {
                        icon: <User size={16} className="mr-1 text-cyan-700" />,
                        label: "Họ và tên",
                        value: confirmationData.fullName,
                      },
                      {
                        icon: <Mail size={16} className="mr-2 text-cyan-700" />,
                        label: "Email",
                        value: confirmationData.email,
                      },
                      {
                        icon: (
                          <Phone size={16} className="mr-2 text-cyan-700" />
                        ),
                        label: "Số điện thoại",
                        value: confirmationData.phoneNumber,
                      },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-gray-100 rounded-lg p-4"
                      >
                        <label className="text-sm font-medium text-cyan-600 flex items-center mb-1">
                          {item.icon} {item.label}
                        </label>
                        <p className="text-gray-800 font-medium">
                          {item.value}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                {/* Booking Info */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center border-b pb-2">
                    <Calendar className="mr-2 text-cyan-600" size={20} />
                    Thông tin đặt phòng
                  </h4>
                  <div className="space-y-4">
                    {[
                      {
                        icon: (
                          <Users size={16} className="mr-2 text-cyan-700" />
                        ),
                        label: "Số khách",
                        value: `${totalGuests} khách (${adults} người lớn${
                          childrenUnder10
                            ? `, ${childrenUnder10} trẻ em dưới 10 tuổi`
                            : ""
                        }${
                          childrenAbove10
                            ? `, ${childrenAbove10} trẻ em từ 10 tuổi`
                            : ""
                        })`,
                      },
                      {
                        icon: (
                          <Calendar size={16} className="mr-2 text-cyan-700" />
                        ),
                        label: "Ngày check-in",
                        value: new Date(
                          confirmationData.checkInDate
                        ).toLocaleDateString("vi-VN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }),
                      },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-gray-100 rounded-lg p-4"
                      >
                        <label className="text-sm font-medium text-cyan-600 flex items-center mb-1">
                          {item.icon} {item.label}
                        </label>
                        <p className="text-gray-800 font-medium">
                          {item.value}
                        </p>
                      </motion.div>
                    ))}
                    {confirmationData.selectedRooms?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gray-100 rounded-lg p-4"
                      >
                        <label className="text-sm font-medium text-cyan-600 flex items-center mb-2">
                          <Home size={16} className="mr-2 text-cyan-700" />
                          Phòng đã chọn
                        </label>
                        <div className="space-y-2">
                          {confirmationData.selectedRooms.map((room, i) => (
                            <div
                              key={i}
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
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Special Requirements */}
              {confirmationData.requirements && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8 bg-cyan-50 rounded-lg p-4 border border-cyan-200"
                >
                  <label className="text-sm font-medium text-cyan-600 flex items-center mb-3">
                    <MessageSquare size={16} className="mr-2 text-cyan-700" />
                    Yêu cầu đặc biệt
                  </label>
                  <p className="text-gray-800 leading-relaxed">
                    {confirmationData.requirements}
                  </p>
                </motion.div>
              )}

              {/* Total Price */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-cyan-100 to-cyan-50 border border-cyan-200 rounded-xl p-6 mb-8"
              >
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
              </motion.div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-100 px-8 py-4 border-t">
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleCancelOrReject}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 border-2 border-red-300 text-red-700 rounded-xl hover:bg-red-100 transition-transform duration-200 disabled:opacity-50"
                >
                  Hủy bỏ
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={confirmAction}
                  disabled={submitting}
                  className="relative flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-xl transition-transform duration-200 disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mx-auto" />
                  ) : (
                    confirmText
                  )}
                  {/* extra decorative circles */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
