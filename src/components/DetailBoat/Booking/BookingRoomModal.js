import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { X, ArrowRight } from "lucide-react";
import { Box, TextField, Typography, Button } from "@mui/material";
import GuestCounter from "./GuestCounter";
import Swal from "sweetalert2";

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
import {
  clearAllErrors,
  resetBookingForm,
  setBookingErrors,
  setEditingBookingId,
  updateBookingForm,
  updateRooms,
} from "../../../redux/actions/bookingActions";
import { closeBookingModal } from "../../../redux/actions";
import { setGuestCounter } from "../../../redux/actions/bookingActions";

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
    selectedRoomServices,
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
    const adults = Number(guestCounter?.adults ?? 0);
    const childrenUnder10 = Number(guestCounter?.childrenUnder10 ?? 0);
    const childrenAbove10 = Number(guestCounter?.childrenAbove10 ?? 0);
    const totalGuests = adults + Math.ceil(childrenAbove10 / 2);
    console.log(
      "[BookingRoomModal] totalGuests (adults + ceil(childrenAbove10/2)):",
      totalGuests
    );
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
      guestCount: totalGuests,
      adults,
      childrenUnder10,
      childrenAbove10,
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
      dispatch(resetBookingForm());
      dispatch(clearAllErrors());
      dispatch(setEditingBookingId(null));
      dispatch({ type: "CLEAR_SELECTION" });
      dispatch({ type: "SET_SELECTED_SCHEDULE", payload: "" });
      dispatch({ type: "SET_SELECTED_MAX_PEOPLE", payload: "all" });
      if (yachtData?._id) {
        dispatch(fetchConsultationRequest(yachtData._id));
      }
      dispatch(closeBookingModal());
    }
  };

  const handleEditConsultation = () => {
    if (consultation?.data) {
      dispatch(setEditingBookingId(consultation.data.bookingId));
      dispatch(updateBookingForm("fullName", consultation.data.fullName));
      dispatch(updateBookingForm("phoneNumber", consultation.data.phoneNumber));
      dispatch(updateBookingForm("email", consultation.data.email));
      dispatch(updateBookingForm("address", consultation.data.address || ""));
      dispatch(
        updateBookingForm("requirements", consultation.data.requirements || "")
      );
      const adults = consultation?.data?.adults ?? 1;
      const childrenAbove10 = consultation?.data?.childrenAbove10 ?? 0;
      const childrenUnder10 = consultation?.data?.childrenUnder10 ?? 0;
      dispatch(
        setGuestCounter({
          adults,
          childrenUnder10,
          childrenAbove10,
        })
      );
      let guestCountValue = `${adults} người lớn`;
      if (childrenAbove10 > 0)
        guestCountValue += `, ${childrenAbove10} trẻ em từ 10 tuổi`;
      if (childrenUnder10 > 0)
        guestCountValue += `, ${childrenUnder10} trẻ em dưới 10 tuổi`;
      dispatch(updateBookingForm("guestCount", guestCountValue));
      let checkInDateValue = "";
      if (consultation.data.checkInDate) {
        const d = new Date(consultation.data.checkInDate);
        checkInDateValue = d.toISOString().slice(0, 10);
      }
      dispatch(updateBookingForm("checkInDate", checkInDateValue));
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
          dispatch(resetBookingForm());
          dispatch(clearAllErrors());
          dispatch(setEditingBookingId(null));
          const today = new Date();
          const formatted = today.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          dispatch(updateBookingForm("checkInDate", formatted));
          setShowConsultationModal(false);
          if (yachtData?._id) {
            dispatch(fetchConsultationRequest(yachtData._id));
          }
        }
      });
    }
  };

  useEffect(() => {
    if (show) {
      if (!editingBookingId) {
      }
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
    dispatch(closeBookingModal());
  };

  const selectedRooms = rooms.filter((r) => r.quantity > 0);
  const maxPeople = selectedRooms.reduce(
    (sum, r) => sum + (r.max_people || 0),
    0
  );
  const { guestCounter } = useSelector((state) => state.booking);
  const totalGuests =
    guestCounter.adults +
    guestCounter.childrenUnder10 +
    Math.ceil(guestCounter.childrenAbove10 / 2);
  const overLimit = maxPeople && totalGuests > maxPeople;

  if (!show) return null;

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          bgcolor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          fontFamily: "Archivo, sans-serif",
          mt: 7,
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: (theme) => theme.shape.borderRadius / 5,
            maxWidth: "56rem",
            width: "100%",
            mx: 2,
            maxHeight: "80vh",
            p: 2,
            overflowY: "auto",
            boxShadow: (theme) => theme.shadows[1],
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              py: 1,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              position: "relative",
            }}
          >
            <Typography
              fontFamily={"Archivo, sans-serif"}
              variant="h6"
              sx={{ fontWeight: "bold", color: "text.primary", mx: "auto" }}
            >
              {editingBookingId ? "Chỉnh sửa yêu cầu" : "Đặt phòng"}
            </Typography>
            <Button
              onClick={handleCloseModal}
              sx={{
                color: "text.secondary",
                "&:hover": { color: "text.primary" },
                minWidth: 0,
              }}
            >
              <X size={24} />
            </Button>
          </Box>
          <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 3 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {" "}
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
                      ? new Date(val + "T00:00:00").toLocaleDateString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
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
                    "& .MuiInputLabel-root": {
                      color: "text.secondary",
                      "&.Mui-focused": { color: "primary.main" },
                      fontFamily: "Archivo, sans-serif",
                    },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: (theme) => theme.shape.borderRadius / 2,
                      "& fieldset": { borderColor: "divider" },
                      "&:hover fieldset": { borderColor: "primary.main" },
                      "&.Mui-focused fieldset": { borderColor: "primary.main" },
                      fontFamily: "Archivo, sans-serif",
                    },
                  }}
                />
                <GuestCounter maxPeople={maxPeople} />
              </Box>
              {/* Hiển thị chi tiết phòng và dịch vụ */}
              <Box
                sx={{
                  bgcolor: "background.paper",
                  p: 2,
                  borderRadius: 2,
                  boxShadow: (theme) => theme.shadows[1],
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                {selectedRooms.map((room) => {
                  const services = selectedRoomServices[room.id] || [];
                  return (
                    <Box key={room.id} sx={{ mb: 1 }}>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          color: "text.primary",
                          fontFamily: "Archivo, sans-serif",
                        }}
                      >
                        {room.name} x {room.quantity}:{" "}
                        {room.price.toLocaleString()}đ/phòng
                      </Typography>
                      {services.length > 0 && (
                        <Box sx={{ ml: 2 }}>
                          {services.map((sv, idx) => (
                            <Typography
                              key={sv.id || idx}
                              sx={{
                                fontSize: "0.95rem",
                                color: "text.secondary",
                                fontFamily: "Archivo, sans-serif",
                              }}
                            >
                              - Dịch vụ: {sv.name} x {room.quantity}:{" "}
                              {(sv.price * room.quantity).toLocaleString()}đ (
                              {sv.price.toLocaleString()}đ/người)
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Box>
                  );
                })}
                {/* Tổng phụ */}
                <Box sx={{ mt: 1, ml: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      color: "text.primary",
                      fontFamily: "Archivo, sans-serif",
                    }}
                  >
                    Tổng tiền phòng:{" "}
                    {selectedRooms
                      .reduce(
                        (sum, room) => sum + room.price * room.quantity,
                        0
                      )
                      .toLocaleString()}{" "}
                    đ
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      color: "text.primary",
                      fontFamily: "Archivo, sans-serif",
                    }}
                  >
                    Tổng tiền dịch vụ:{" "}
                    {selectedRooms
                      .reduce(
                        (sum, room) =>
                          sum +
                          (selectedRoomServices[room.id]?.reduce(
                            (s, sv) => s + sv.price * room.quantity,
                            0
                          ) || 0),
                        0
                      )
                      .toLocaleString()}{" "}
                    đ
                  </Typography>
                </Box>
              </Box>
            </Box>

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
                "& .MuiInputLabel-root": {
                  color: "text.secondary",
                  "&.Mui-focused": { color: "primary.main" },
                  fontFamily: "Archivo, sans-serif",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: (theme) => theme.shape.borderRadius / 2,
                  "& fieldset": { borderColor: "divider" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
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
                "& .MuiInputLabel-root": {
                  color: "text.secondary",
                  "&.Mui-focused": { color: "primary.main" },
                  fontFamily: "Archivo, sans-serif",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: (theme) => theme.shape.borderRadius / 2,
                  "& fieldset": { borderColor: "divider" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
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
                "& .MuiInputLabel-root": {
                  color: "text.secondary",
                  "&.Mui-focused": { color: "primary.main" },
                  fontFamily: "Archivo, sans-serif",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: (theme) => theme.shape.borderRadius / 2,
                  "& fieldset": { borderColor: "divider" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
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
                "& .MuiInputLabel-root": {
                  color: "text.secondary",
                  "&.Mui-focused": { color: "primary.main" },
                  fontFamily: "Archivo, sans-serif",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: (theme) => theme.shape.borderRadius / 5,
                  "& fieldset": { borderColor: "divider" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                pt: 2,
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Box
                sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography
                  fontFamily={"Archivo, sans-serif"}
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "text.primary" }}
                >
                  Tổng tiền
                </Typography>
                <Typography
                  fontFamily={"Archivo, sans-serif"}
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  {selectedRooms
                    .reduce(
                      (sum, room) =>
                        sum +
                        room.price * room.quantity +
                        (selectedRoomServices[room.id]?.reduce(
                          (s, sv) => s + sv.price * room.quantity,
                          0
                        ) || 0),
                      0
                    )
                    .toLocaleString()}{" "}
                  đ
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 2,
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                {editingBookingId ? (
                  <Button
                    onClick={() => handleSubmit("consultation_requested")}
                    disabled={submitting}
                    variant="outlined"
                    sx={{
                      flex: 1,
                      borderRadius: (theme) => theme.shape.borderRadius / 2,
                      textTransform: "none",
                      borderColor: "#f59e0b",
                      color: "#f59e0b",
                      "&:hover": {
                        borderColor: "#d97706",
                        color: "#d97706",
                        bgcolor: "background.default",
                      },
                    }}
                  >
                    {submitting ? "Đang cập nhật..." : "Cập nhật yêu cầu"}
                  </Button>
                ) : hasConsultation ? (
                  <Button
                    onClick={() => setShowConsultationModal(true)}
                    disabled={submitting}
                    variant="outlined"
                    sx={{
                      flex: 1,
                      borderRadius: (theme) => theme.shape.borderRadius / 2,
                      textTransform: "none",
                      borderColor: "divider",
                      color: "text.primary",
                      fontFamily: "Archivo, sans-serif",
                      "&:hover": { bgcolor: "background.default" },
                    }}
                  >
                    Xem yêu cầu đã gửi
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSubmit("consultation_requested")}
                    disabled={submitting}
                    variant="outlined"
                    sx={{
                      flex: 1,
                      borderRadius: (theme) => theme.shape.borderRadius / 2,
                      textTransform: "none",
                      borderColor: "divider",
                      color: "text.primary",
                      fontFamily: "Archivo, sans-serif",
                      "&:hover": { bgcolor: "background.default" },
                    }}
                  >
                    {submitting ? "Đang xử lý..." : "Đăng ký tư vấn"}
                  </Button>
                )}
                <Button
                  onClick={() => handleSubmit("pending_payment")}
                  disabled={submitting}
                  variant="contained"
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: (theme) => theme.shape.borderRadius / 2,
                    textTransform: "none",
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    fontFamily: "Archivo, sans-serif",
                    "&:hover": { bgcolor: "primary.dark" },
                    display: "flex",
                    gap: 1,
                  }}
                >
                  {submitting ? "Đang xử lý..." : "Đặt ngay"}
                  <ArrowRight />
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
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
