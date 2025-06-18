import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Minus, Plus, X } from "lucide-react";
import { Box, Select, MenuItem, FormControl, InputLabel, Button, Typography } from "@mui/material";
import RoomModal from "./RoomModal";

import BookingRoomModal from "./Booking/BookingRoomModal";
import {
  incrementRoomQuantity,
  decrementRoomQuantity,
  setSelectedSchedule,
  setSelectedMaxPeople,
  clearSelection,
  resetBookingForm,
  setEditingBookingId,
  clearAllErrors,
} from "../../redux/actions/bookingActions";
import {
  openRoomModal,
  closeRoomModal,
  openBookingModal,
  closeBookingModal,
  closeConfirmationModal,
  closeTransactionModal,
} from "../../redux/actions/uiActions";
import { fetchRoomsAndSchedules } from "../../redux/asyncActions/bookingAsyncActions";
import ConfirmationModal from "./Booking/ConfirmationModal";
import TransactionModal from "./Booking/TransactionModal";
import InvoiceModal from "./Booking/InvoiceModal";

function RoomSelector({ yachtId, yachtData = {} }) {
  const dispatch = useDispatch();

  // Select state from Redux store
  const { rooms, schedules, loading, error, selectedSchedule, selectedMaxPeople, maxPeopleOptions } = useSelector(
    (state) => state.booking
  );
  const { showRoomModal, showBookingModal, selectedRoomForModal } = useSelector((state) => state.ui.modals);

  // Fetch rooms and schedules when yachtId or selectedSchedule changes
  useEffect(() => {
    if (yachtId) {
      dispatch(fetchRoomsAndSchedules(yachtId, selectedSchedule));
    } else {
      dispatch(clearSelection());
    }
  }, [yachtId, selectedSchedule, dispatch]);

  // Handlers for buttons
  const handleBookNow = () => {
    dispatch(resetBookingForm());
    dispatch(clearAllErrors());
    dispatch(setEditingBookingId(null));
    dispatch(openBookingModal());
  };

  const handleClearSelection = () => {
    dispatch(clearSelection());
    dispatch(setSelectedSchedule(""));
    dispatch(setSelectedMaxPeople("all"));
  };

  // Handler for opening room modal
  const handleOpenRoomModal = (room) => {
    dispatch(openRoomModal(room));
  };

  // Filter rooms based on selectedMaxPeople
  const filteredRooms =
    selectedMaxPeople === "all" ? rooms : rooms.filter((room) => room.beds === parseInt(selectedMaxPeople));

  // Get selected rooms for BookingRoomModal
  const getSelectedRooms = () => {
    return rooms.filter((room) => room.quantity > 0);
  };

  const [editBookingData, setEditBookingData] = useState(null);

  return (
    <div>
      <h2 className="text-4xl font-bold light:text-gray-900">Các loại phòng & giá</h2>
      <img src="../icons/heading-border.webp" alt="Divider" className="my-6" />
      <Box
        sx={{
          bgcolor: (theme) => theme.palette.background.paper,
          padding: 5,
          borderRadius: "30px",
          boxShadow: 3,
        }}
      >
        {/* Luôn hiển thị nút "Xoá lựa chọn" */}
        <div className="flex justify-end mb-4">
          <Button
            onClick={handleClearSelection}
            variant="outlined"
            startIcon={<X size={20} />}
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              borderRadius: "20px",
              textTransform: "none",
              borderColor: (theme) => theme.palette.purple.main, // Viền tím
              color: (theme) => theme.palette.purple.main, // Chữ tím
              position: "relative", // Để tạo hiệu ứng lan tỏa
              overflow: "hidden", // Ẩn phần lan tỏa thừa
              "&:hover": {
                borderColor: (theme) => theme.palette.purple.dark, // Viền đậm hơn khi hover
                color: (theme) => theme.palette.purple.dark, // Chữ đậm hơn khi hover
                backgroundColor: (theme) => theme.palette.background.default, // Hover nhẹ
                boxShadow: (theme) => theme.shadows[2], // Hiệu ứng shadow khi hover
                transform: "translateY(-1px)", // Nâng nhẹ
              },
              "&:active::after": {
                // Hiệu ứng lan tỏa khi click
                content: '""',
                position: "absolute",
                width: "100px",
                height: "100px",
                background: (theme) => theme.palette.purple.main,
                borderRadius: "50%",
                opacity: 0.3,
                animation: "ripple 0.6s linear",
                transform: "scale(0)",
                pointerEvents: "none",
              },
              "@keyframes ripple": {
                // Animation lan tỏa
                to: {
                  transform: "scale(4)",
                  opacity: 0,
                },
              },
            }}
          >
            Xoá lựa chọn
          </Button>
        </div>

        {/* Danh sách chọn lịch trình (hiển thị chi tiết ngày tháng nào) */}
        <FormControl fullWidth variant="outlined" margin="normal" sx={{ mb: 3 }}>
          <InputLabel>Chọn lịch trình</InputLabel>
          <Select
            value={selectedSchedule}
            onChange={(e) => dispatch(setSelectedSchedule(e.target.value))}
            label="Chọn lịch trình"
            disabled={loading || schedules.length === 0}
            sx={{
              bgcolor: (theme) => theme.palette.background.paper,
              borderColor: (theme) => theme.palette.divider,
              boxShadow: (theme) => theme.shadows[1],
              color: (theme) => theme.palette.primary.main,
            }}
          >
            {schedules
              .slice() // Tạo bản sao để không mutate state gốc
              .sort((a, b) => new Date(a.scheduleId.startDate) - new Date(b.scheduleId.startDate))
              .map((schedule) => (
                <MenuItem key={schedule._id} value={schedule._id}>
                  {schedule.displayText || "Không xác định"}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {/* Max People Selection */}
        {selectedSchedule && (
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel>Số người tối đa</InputLabel>
            <Select
              value={selectedMaxPeople}
              onChange={(e) => dispatch(setSelectedMaxPeople(e.target.value))}
              label="Số người tối đa"
              disabled={loading || !rooms.length}
              sx={{
                bgcolor: (theme) => theme.palette.background.paper,
                borderColor: (theme) => theme.palette.divider,
                boxShadow: (theme) => theme.shadows[1],
                color: (theme) => theme.palette.primary.main,
              }}
            >
              <MenuItem value="all">Hiển thị tất cả</MenuItem>
              {maxPeopleOptions.map((maxPeople) => (
                <MenuItem key={maxPeople} value={maxPeople}>
                  {maxPeople} {maxPeople > 1 ? "người" : "người"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {loading && <div>Đang tải dữ liệu...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && schedules.length === 0 && yachtId && (
          <div>Không tìm thấy lịch trình cho Yacht ID này</div>
        )}

        {selectedSchedule && (
          <>
            {loading && <Typography sx={{ color: "text.primary", p: 2 }}>Đang tải phòng...</Typography>}
            {!loading && !error && filteredRooms.length === 0 && (
              <Typography sx={{ color: "text.primary", p: 2 }}>
                Không tìm thấy phòng phù hợp với lựa chọn này
              </Typography>
            )}
            {filteredRooms.length > 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {filteredRooms.map((room) => (
                    <Box
                      key={room.id}
                      sx={{
                        bgcolor: "background.paper",
                        p: 2,
                        borderRadius: (theme) => theme.shape.borderRadius / 5,
                        boxShadow: (theme) => theme.shadows[1],
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: { xs: "wrap", sm: "nowrap" },
                        gap: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "text.primary" }}>
                        <Box
                          component="img"
                          src={room.image}
                          alt={room.name}
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 2,
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                          onClick={() => handleOpenRoomModal(room)}
                        />
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              fontSize: "1rem",
                              textDecoration: "underline",
                              cursor: "pointer",
                              color: "text.primary",
                              "&:hover": { color: "primary.main" },
                            }}
                            onClick={() => handleOpenRoomModal(room)}
                          >
                            {room.name}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 3, color: "text.secondary", fontSize: "0.875rem" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <Box
                                component="svg"
                                sx={{ width: 16, height: 16, fill: "currentColor" }}
                                viewBox="0 0 24 24"
                              >
                                <path d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4C2.89,21 2,20.1 2,19V8C2,6.89 2.89,6 4,6H8V4C8,2.89 8.89,2 10,2M14,6V4H10V6H14Z" />
                              </Box>
                              {room.area} m{"\u00B2"} {/*mét vuông*/}
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <Box
                                component="svg"
                                sx={{ width: 16, height: 16, fill: "currentColor" }}
                                viewBox="0 0 24 24"
                              >
                                <path d="M19,7H5C3.89,7 3,7.89 3,9V17H5V13H19V17H21V9C21,7.89 20.11,7 19,7M19,11H5V9H19V11Z" />
                              </Box>
                              Tối đa: {room.beds} <User size={15} />
                            </Box>
                          </Box>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, flexShrink: 0 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <Typography sx={{ color: "primary.main", fontSize: "1.125rem", fontWeight: "bold" }}>
                              {room.price.toLocaleString()}đ{" "}
                            </Typography>
                            <Typography sx={{ color: "primary.main", fontSize: "1.125rem", fontWeight: "medium" }}>
                              {" "}
                              / khách
                            </Typography>
                          </Box>
                          <Button
                            onClick={() => handleOpenRoomModal(room)}
                            variant="outlined"
                            sx={{
                              borderRadius: (theme) => theme.shape.borderRadius / 2,
                              textTransform: "none",
                              borderColor: "divider",
                              color: "text.primary",
                              "&:hover": { bgcolor: "background.default" },
                              mt: 1, // Khoảng cách trên cho nút
                            }}
                          >
                            Chọn dịch vụ
                          </Button>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            border: (theme) => `1px solid ${theme.palette.divider}`,
                            borderRadius: (theme) => theme.shape.borderRadius / 2,
                            bgcolor: "background.paper",
                            boxShadow: (theme) => theme.shadows[1],
                          }}
                        >
                          <Button
                            onClick={() => dispatch(decrementRoomQuantity(room.id))}
                            sx={{
                              minWidth: 32,
                              height: 32,
                              borderRadius: "50%",
                              color: "text.primary",
                              "&:hover": { bgcolor: "background.default" },
                            }}
                          >
                            <Minus size={16} />
                          </Button>
                          <Typography sx={{ mx: 1, width: "auto", textAlign: "center", color: "text.primary" }}>
                            {room.quantity}
                          </Typography>
                          <Button
                            onClick={() => dispatch(incrementRoomQuantity(room.id))}
                            sx={{
                              minWidth: 32,
                              height: 32,
                              borderRadius: "50%",
                              color: "text.primary",
                              "&:hover": { bgcolor: "background.default" },
                            }}
                          >
                            <Plus size={16} />
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Box
                  sx={{
                    mt: 4,
                    p: 3,
                    borderRadius: (theme) => theme.shape.borderRadius / 2,
                    boxShadow: (theme) => theme.shadows[1],
                    bgcolor: "background.paper",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      bgcolor: "background.default",
                      p: 2,
                      borderRadius: 2,
                    }}
                  >
                    <Typography sx={{ color: "text.secondary", fontSize: "1rem", fontWeight: "medium" }}>
                      Tổng tiền:
                    </Typography>
                    <Typography sx={{ color: "primary.main", fontSize: "1.25rem", fontWeight: "bold" }}>
                      {rooms.reduce((sum, room) => sum + room.price * room.quantity, 0).toLocaleString()} đ
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Button
                      onClick={handleBookNow}
                      variant="contained"
                      sx={{
                        borderRadius: (theme) => theme.shape.borderRadius / 2,
                        textTransform: "none",
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        px: 3,
                        py: 1,
                        display: "flex",
                        gap: 1,
                        "&:hover": { bgcolor: "primary.dark" },
                      }}
                    >
                      <span style={{ fontSize: "1.05rem" }}>Đặt ngay</span>
                      <Box component="svg" sx={{ width: 16, height: 16, fill: "currentColor" }} viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" />
                      </Box>
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>

      <RoomModal
        show={showRoomModal}
        room={selectedRoomForModal}
        onClose={() => dispatch(closeRoomModal())}
        onIncrement={(roomId) => dispatch(incrementRoomQuantity(roomId))}
        onDecrement={(roomId) => dispatch(decrementRoomQuantity(roomId))}
      />

      {/* chọn phòng */}
      <BookingRoomModal
        show={showBookingModal}
        onClose={() => dispatch(closeBookingModal())}
        selectedRooms={getSelectedRooms()}
        yachtData={yachtData}
        onBack={null}
        editData={editBookingData}
      />

      {/* Modal xác nhận */}
      <ConfirmationModal
        onBack={(data) => {
          setEditBookingData(data);
          dispatch(openBookingModal());
          dispatch(closeConfirmationModal());
        }}
      />

      {/* Modal giao dịch */}
      <TransactionModal
        onBack={() => {
          dispatch(closeTransactionModal());
          dispatch(openBookingModal());
        }}
      />

      {/* Modal hoá đơn */}
      <InvoiceModal />
    </div>
  );
}

export default RoomSelector;
