import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { X, ArrowRight, Edit } from "lucide-react";
import { Box, TextField, Modal, Typography } from "@mui/material";
import GuestCounter from "./GuestCounter";
import Swal from "sweetalert2";
import {
  updateBookingForm,
  setBookingErrors,
  closeBookingModal,
  clearAllErrors,
  updateRooms,
  setEditingBookingId,
  resetBookingForm,
} from "../../../redux/action";
import {
  validateBookingForm,
  formatPrice,
  validateRoomSelection,
} from "../../../redux/validation";
import {
  cancelConsultationRequestById,
  createBookingOrConsultationRequest,
  fetchConsultationRequest,
  updateBookingOrConsultationRequest,
} from "../../../redux/asyncActions";
import ConsultationDetailsModal from "./ConsultationDetailModal";

const BookingRoomModal = ({ show, yachtData }) => {
  const dispatch = useDispatch();
  const {
    bookingForm,
    bookingErrors,
    rooms,
    totalPrice,
    submitting,
    selectedSchedule,
    consultation,
    hasConsultation,
    editingBookingId,
  } = useSelector((state) => state.booking);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  useEffect(() => {
    if (show && yachtData?._id) {
      dispatch(fetchConsultationRequest(yachtData._id));
    }
  }, [show, yachtData, dispatch]);

  const handleInputChange = (field, value) => {
    dispatch(updateBookingForm(field, value));
    if (bookingErrors[field]) {
      dispatch(setBookingErrors({ [field]: null }));
    }
  };

  const validateAllForms = () => {
    const formValidation = validateBookingForm(bookingForm);
    const roomValidation = validateRoomSelection(
      rooms.filter((r) => r.quantity > 0),
      selectedSchedule,
      bookingForm.guestCount
    );

    const allErrors = { ...formValidation.errors, ...roomValidation.errors };
    if (Object.keys(allErrors).length > 0) {
      dispatch(setBookingErrors(allErrors));
      const firstError = Object.values(allErrors)[0];
      Swal.fire({
        icon: "error",
        title: "Thông tin chưa hợp lệ!",
        text: firstError,
      });
      return false;
    }
    dispatch(clearAllErrors());
    return true;
  };

  const prepareSharedBookingData = () => {
    let isoCheckInDate = bookingForm.checkInDate;
    if (bookingForm.checkInDate && !bookingForm.checkInDate.includes("T")) {
      try {
        const [day, month, year] = bookingForm.checkInDate.split("/");
        isoCheckInDate = new Date(
          `${year}-${month}-${day}T00:00:00.000Z`
        ).toISOString();
      } catch (e) {
        console.error("Lỗi chuyển đổi ngày:", e);
      }
    }

    return {
      fullName: bookingForm.fullName,
      phoneNumber: bookingForm.phoneNumber,
      email: bookingForm.email,
      guestCount: parseInt(bookingForm.guestCount, 10) || 1,
      requirements: bookingForm.requirements || "",
      checkInDate: isoCheckInDate,
      address: bookingForm.address || "",
      selectedRooms: rooms
        .filter((r) => r.quantity > 0)
        .map((r) => ({
          id: r._id || r.id,
          name: r.name,
          quantity: r.quantity,
          price: r.price,
          description: r.description,
          area: r.area,
          avatar: r.avatar,
          max_people: r.max_people,
          beds: r.beds,
          image: r.images && r.images.length > 0 ? r.images[0] : r.avatar || "",
        })),
      totalPrice,
      yachtId: yachtData._id,
      scheduleId: selectedSchedule?._id || selectedSchedule || null,
      bookingId: consultation?.data?.bookingId || null,
    };
  };
  // Unified submission handler
  const handleSubmit = async (requestType) => {
    if (!validateAllForms()) return;
    const sharedData = prepareSharedBookingData();

    let result;
    if (editingBookingId) {
      const { bookingId, ...dataForUpdate } = sharedData;
      result = await dispatch(
        updateBookingOrConsultationRequest(
          editingBookingId,
          dataForUpdate,
          requestType
        )
      );
      dispatch(setEditingBookingId(null));
    } else {
      result = await dispatch(
        createBookingOrConsultationRequest(sharedData, requestType)
      );
    }

    if (result && result.payload && result.payload.success) {
      // Reset form booking
      dispatch(resetBookingForm());
      dispatch(clearAllErrors());
      dispatch(setEditingBookingId(null));
      // Reset chọn phòng (RoomSelector)
      dispatch({ type: "CLEAR_SELECTION" });
      dispatch({ type: "SET_SELECTED_SCHEDULE", payload: "" });
      dispatch({ type: "SET_SELECTED_MAX_PEOPLE", payload: "all" });
      // Refresh consultation data nếu cần
      if (yachtData?._id) {
        dispatch(fetchConsultationRequest(yachtData._id));
      }
      dispatch(closeBookingModal());
    }
  };

  const handleEditConsultation = () => {
    if (consultation?.data) {
      // Set the ID for editing
      dispatch(setEditingBookingId(consultation.data.bookingId));
      dispatch(updateBookingForm("fullName", consultation.data.fullName));
      dispatch(updateBookingForm("phoneNumber", consultation.data.phoneNumber));
      dispatch(updateBookingForm("email", consultation.data.email));
      dispatch(updateBookingForm("address", consultation.data.address || ""));
      dispatch(
        updateBookingForm("guestCount", consultation.data.guestCount.toString())
      );
      // Sửa guestCount về đúng format
      let guestCountValue = consultation.data.guestCount;
      if (
        typeof guestCountValue === "number" ||
        /^[0-9]+$/.test(guestCountValue)
      ) {
        guestCountValue = `${guestCountValue} Người lớn - 0 - Trẻ em`;
      }
      dispatch(updateBookingForm("guestCount", guestCountValue));
      dispatch(
        updateBookingForm("requirements", consultation.data.requirements || "")
      );
      // Sửa checkInDate về đúng format YYYY-MM-DD
      let checkInDateValue = "";
      if (consultation.data.checkInDate) {
        const d = new Date(consultation.data.checkInDate);
        checkInDateValue = d.toISOString().slice(0, 10); // YYYY-MM-DD
      }
      dispatch(updateBookingForm("checkInDate", checkInDateValue));
      // Update rooms
      dispatch(
        updateRooms(
          consultation.data.selectedRooms.map((room) => ({
            ...room,
            _id: room.id,
            id: room.id,
            images: room.image ? [room.image] : [],
          }))
        )
      );

      setShowConsultationModal(false);
    } else {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không tìm thấy dữ liệu yêu cầu tư vấn.",
      });
    }
  };

  const handleCancelConsultation = () => {
    if (consultation?.data?.bookingId) {
      Swal.fire({
        title: "Bạn có chắc muốn hủy yêu cầu tư vấn?",
        text: "Hành động này không thể hoàn tác.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Đúng, hủy nó!",
        cancelButtonText: "Không",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await dispatch(
            cancelConsultationRequestById(consultation.data.bookingId)
          );

          // Reset form và state sau khi hủy thành công
          dispatch(resetBookingForm());
          dispatch(clearAllErrors());
          dispatch(setEditingBookingId(null));

          // Set ngày hiện tại
          const today = new Date();
          const formatted = today.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          dispatch(updateBookingForm("checkInDate", formatted));

          setShowConsultationModal(false);

          // Refresh consultation data
          if (yachtData?._id) {
            dispatch(fetchConsultationRequest(yachtData._id));
          }
        }
      });
    }
  };

  useEffect(() => {
    if (show) {
      // Reset form mỗi khi modal được mở (trừ khi đang edit)
      if (!editingBookingId) {
        // Không reset bookingForm ở đây để giữ lại dữ liệu khi đóng mở modal
        // dispatch(resetBookingForm());
        // dispatch(clearAllErrors());
        // Set ngày hiện tại nếu cần
        // const today = new Date();
        // const formatted = today.toLocaleDateString("vi-VN", {
        //   day: "2-digit",
        //   month: "2-digit",
        //   year: "numeric",
        // });
        // dispatch(updateBookingForm("checkInDate", formatted));
      }
      // Fetch consultation nếu có yachtData
      if (yachtData?._id) {
        dispatch(fetchConsultationRequest(yachtData._id));
      }
    }
  }, [show, editingBookingId, yachtData, dispatch]);

  const handleCloseModal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // KHÔNG reset form khi đóng modal
    dispatch(closeBookingModal());
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Box
          className="rounded-3xl max-w-4xl mt-16 w-full mx-4 max-h-[80vh] p-5 overflow-y-auto"
          sx={{
            bgcolor: (theme) => theme.palette.background.paper,
            borderColor: (theme) => theme.palette.divider,
            boxShadow: (theme) => theme.shadows[1],
          }}
        >
          <div className="flex justify-between items-center p-3 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              {" "}
              {editingBookingId ? "Chỉnh sửa yêu cầu" : "Đặt phòng"}
            </h2>

            <button
              onClick={handleCloseModal}
              type="button"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <TextField
                fullWidth
                label="Ngày nhận phòng"
                type="date"
                value={
                  bookingForm.checkInDate &&
                  bookingForm.checkInDate.includes("/")
                    ? `${bookingForm.checkInDate.split("/")[2]}-${
                        bookingForm.checkInDate.split("/")[1]
                      }-${bookingForm.checkInDate.split("/")[0]}`
                    : bookingForm.checkInDate || ""
                }
                onChange={(e) => {
                  const val = e.target.value;
                  const formattedForDisplay = val
                    ? new Date(val + "T00:00:00").toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "";
                  handleInputChange("checkInDate", formattedForDisplay);
                }}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: new Date().toISOString().split("T")[0],
                }}
                variant="outlined"
                error={!!bookingErrors.checkInDate}
                helperText={bookingErrors.checkInDate}
                sx={{
                  fontFamily: "Archivo, sans-serif",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "32px",
                    fontFamily: "Archivo, sans-serif",
                    "& fieldset": { borderColor: "#d1d5db" },
                    "&:hover fieldset": { borderColor: "#14b8a6" },
                    "&.Mui-focused fieldset": { borderColor: "#14b8a6" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#374151",
                    "&.Mui-focused": { color: "#14b8a6" },
                  },
                }}
              />
              <GuestCounter />
            </div>
            <TextField
              fullWidth
              label="Họ và tên"
              value={bookingForm.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              error={!!bookingErrors.fullName}
              helperText={bookingErrors.fullName}
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "32px",
                  "& fieldset": { borderColor: "#d1d5db" },
                  "&:hover fieldset": { borderColor: "#14b8a6" },
                  "&.Mui-focused fieldset": { borderColor: "#14b8a6" },
                },
                "& .MuiInputLabel-root": {
                  color: "#374151",
                  fontFamily: "Archivo, sans-serif",
                  "&.Mui-focused": { color: "#14b8a6" },
                },
              }}
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              value={bookingForm.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              error={!!bookingErrors.phoneNumber}
              helperText={bookingErrors.phoneNumber}
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "32px",
                  fontFamily: "Archivo, sans-serif",
                  "& fieldset": { borderColor: "#d1d5db" },
                  "&:hover fieldset": { borderColor: "#14b8a6" },
                  "&.Mui-focused fieldset": { borderColor: "#14b8a6" },
                },
                "& .MuiInputLabel-root": {
                  color: "#374151",
                  fontFamily: "Archivo, sans-serif",
                  "&.Mui-focused": { color: "#14b8a6" },
                },
              }}
            />
            <TextField
              fullWidth
              label="Địa chỉ email"
              type="email"
              value={bookingForm.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={!!bookingErrors.email}
              helperText={bookingErrors.email}
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "32px",
                  fontFamily: "Archivo, sans-serif",
                  "& fieldset": { borderColor: "#d1d5db" },
                  "&:hover fieldset": { borderColor: "#14b8a6" },
                  "&.Mui-focused fieldset": { borderColor: "#14b8a6" },
                },
                "& .MuiInputLabel-root": {
                  color: "#374151",
                  fontFamily: "Archivo, sans-serif",
                  "&.Mui-focused": { color: "#14b8a6" },
                },
              }}
            />
            <TextField
              fullWidth
              label="Yêu cầu của bạn"
              placeholder="Nhập yêu cầu của bạn"
              multiline
              rows={4}
              value={bookingForm.requirements}
              onChange={(e) =>
                handleInputChange("requirements", e.target.value)
              }
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "32px",
                  fontFamily: "Archivo, sans-serif",
                  "& fieldset": { borderColor: "#d1d5db" },
                  "&:hover fieldset": { borderColor: "#14b8a6" },
                  "&.Mui-focused fieldset": { borderColor: "#14b8a6" },
                },
                "& .MuiInputLabel-root": {
                  color: "#374151",
                  fontFamily: "Archivo, sans-serif",
                  "&.Mui-focused": { color: "#14b8a6" },
                },
              }}
            />
            <div className="flex items-center pt-4 border-t">
              <div className="flex w-1/3 items-center">
                <span className="text-lg font-bold text-gray-800">
                  Tổng tiền
                </span>
                <span className="ml-2 text-xl font-bold text-teal-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <div className="flex w-2/3 justify-end space-x-3 pt-2">
                {editingBookingId ? (
                  <button
                    onClick={() => handleSubmit("consultation_requested")}
                    disabled={submitting}
                    className="flex-1 py-3 px-4 border border-yellow-400 text-yellow-700 rounded-3xl hover:bg-yellow-50 font-medium transition-colors"
                  >
                    <p className="flex items-center mx-auto justify-center gap-2">
                      {submitting ? "Đang cập nhật..." : "Cập nhật yêu cầu"}
                    </p>
                  </button>
                ) : hasConsultation ? (
                  <button
                    onClick={() => setShowConsultationModal(true)}
                    disabled={submitting}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-3xl hover:bg-gray-50 font-medium transition-colors"
                  >
                    <p className="flex items-center mx-auto justify-center gap-2">
                      Xem yêu cầu đã gửi
                    </p>
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubmit("consultation_requested")}
                    disabled={submitting}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-3xl hover:bg-gray-50 font-medium transition-colors"
                  >
                    <p className="flex items-center mx-auto justify-center gap-2">
                      {submitting ? "Đang xử lý..." : "Đăng ký tư vấn"}
                    </p>
                  </button>
                )}
                <button
                  onClick={() => handleSubmit("pending_payment")}
                  disabled={submitting}
                  className="flex-1 py-3 px-4 bg-teal-400 text-white rounded-3xl hover:bg-teal-500 font-medium transition-colors"
                >
                  <p className="flex items-center mx-auto justify-center gap-2">
                    {submitting ? "Đang xử lý..." : "Đặt ngay"}
                    <ArrowRight />
                  </p>
                </button>
              </div>
            </div>
          </div>
        </Box>
      </div>
      <ConsultationDetailsModal
        open={showConsultationModal}
        onClose={() => setShowConsultationModal(false)}
        consultation={consultation?.data}
        onEdit={handleEditConsultation}
        onCancel={handleCancelConsultation}
      />
    </>
  );
};

export default BookingRoomModal;
