import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BedDouble, Building, Minus, Plus, Type, User, X } from "lucide-react";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
} from "@mui/material";
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
  setSelectedYachtServices,
} from "../../redux/actions/bookingActions";
import {
  openRoomModal,
  closeRoomModal,
  openBookingModal,
  closeBookingModal,
  closeConfirmationModal,
  closeTransactionModal,
} from "../../redux/actions/uiActions";
import {
  fetchSchedulesOnly,
  fetchRoomsOnly,
} from "../../redux/asyncActions/bookingAsyncActions";
import ConfirmationModal from "./Booking/ConfirmationModal";
import TransactionModal from "./Booking/TransactionModal";
import InvoiceModal from "./Booking/InvoiceModal";
import RoomServicesModal from "./RoomServicesModal";
import { getScheduleById } from "../../utils/scheduleHelpers";

function RoomSelector({ yachtId, yachtData = {} }) {
  const dispatch = useDispatch();

  // Select state from Redux store
  const {
    rooms,
    schedules,
    loading,
    error,
    selectedSchedule,
    selectedMaxPeople,
    selectedYachtServices,
    maxPeopleOptions,
  } = useSelector((state) => state.booking);
  const { showRoomModal, showBookingModal, selectedRoomForModal } = useSelector(
    (state) => state.ui.modals
  );
  const [editBookingData, setEditBookingData] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);

  useEffect(() => {
    if (yachtId) {
      dispatch(fetchSchedulesOnly(yachtId));
    } else {
      dispatch(clearSelection());
    }
  }, [yachtId, dispatch]);

  useEffect(() => {
    if (yachtId && selectedSchedule) {
      dispatch(fetchRoomsOnly(yachtId, selectedSchedule));
    }
  }, [yachtId, selectedSchedule, dispatch]);

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

  const handleOpenRoomModal = (room) => {
    dispatch(openRoomModal(room));
  };
  const handleSelectYachtServices = (services) => {
    dispatch(setSelectedYachtServices(services));
    setShowServiceModal(false);
  };

  // Filter rooms theo số người tối đa (max_people)
  const filteredRooms =
    selectedMaxPeople === "all"
      ? rooms
      : rooms.filter((room) => room.max_people === parseInt(selectedMaxPeople));

  // Get selected rooms for BookingRoomModal
  const getSelectedRooms = () => {
    return rooms.filter((room) => room.quantity > 0);
  };

  // Tính tổng tiền dịch vụ theo du thuyền
  const totalServicePrice = selectedYachtServices.reduce(
    (sum, sv) =>
      sum + sv.price * rooms.reduce((acc, room) => acc + room.quantity, 0),
    0
  );
  const totalPrice =
    rooms.reduce((sum, room) => sum + room.price * room.quantity, 0) +
    totalServicePrice;

  return (
    <div>
      <h2 className="text-4xl font-bold light:text-gray-900">
        Các loại phòng & giá
      </h2>
      <img src="../icons/heading-border.webp" alt="Divider" className="my-6" />
      <Box
        sx={{
          bgcolor: (theme) => theme.palette.background.paper,
          padding: 5,
          borderRadius: "30px",
          boxShadow: 3,
        }}
      >
        {/* Nút chọn dịch vụ cho toàn bộ du thuyền */}
        <Box className="flex justify-end mb-4">
          <Button
            onClick={handleClearSelection}
            variant="outlined"
            startIcon={<X size={20} />}
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              borderRadius: "20px",
              textTransform: "none",
              borderColor: (theme) => theme.palette.purple.main,
              color: (theme) => theme.palette.purple.main,
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                borderColor: (theme) => theme.palette.purple.dark,
                color: (theme) => theme.palette.purple.dark,
                backgroundColor: (theme) => theme.palette.background.default,
                boxShadow: (theme) => theme.shadows[2],
                transform: "translateY(-1px)",
              },
              "&:active::after": {
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
                to: {
                  transform: "scale(4)",
                  opacity: 0,
                },
              },
            }}
          >
            Xoá lựa chọn
          </Button>
        </Box>

        {/* Danh sách chọn lịch trình (hiển thị chi tiết ngày tháng nào) */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ minWidth: 220 }}
            margin="normal"
          >
            <InputLabel>Chọn lịch trình</InputLabel>
            <Select
              value={selectedSchedule}
              onChange={(e) => dispatch(setSelectedSchedule(e.target.value))}
              label="Chọn lịch trình"
              disabled={
                loading ||
                !(schedules[yachtId] && schedules[yachtId].length > 0)
              }
              sx={{
                bgcolor: (theme) => theme.palette.background.paper,
                borderColor: (theme) => theme.palette.divider,
                boxShadow: (theme) => theme.shadows[1],
                color: (theme) => theme.palette.primary.main,
              }}
            >
              {(schedules[yachtId] || [])
                .slice()
                .sort(
                  (a, b) =>
                    new Date(a.scheduleId.startDate) -
                    new Date(b.scheduleId.startDate)
                )
                .map((schedule) => (
                  <MenuItem key={schedule._id} value={String(schedule._id)}>
                    {schedule.displayText ||
                      `${schedule.days || ""} ngày ${
                        schedule.nights || ""
                      } đêm (từ ${
                        schedule.scheduleId?.startDate
                          ? new Date(
                              schedule.scheduleId.startDate
                            ).toLocaleDateString("vi-VN")
                          : ""
                      } đến ${
                        schedule.scheduleId?.endDate
                          ? new Date(
                              schedule.scheduleId.endDate
                            ).toLocaleDateString("vi-VN")
                          : ""
                      })`}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* Filter số lượng người */}
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ minWidth: 180 }}
            margin="normal"
          >
            <InputLabel>Chọn số người</InputLabel>
            <Select
              value={selectedMaxPeople}
              onChange={(e) => dispatch(setSelectedMaxPeople(e.target.value))}
              label="Chọn số người"
              disabled={loading || maxPeopleOptions.length === 0}
              sx={{
                bgcolor: (theme) => theme.palette.background.paper,
                borderColor: (theme) => theme.palette.divider,
                boxShadow: (theme) => theme.shadows[1],
                color: (theme) => theme.palette.primary.main,
              }}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              {maxPeopleOptions.map((num) => (
                <MenuItem key={num} value={String(num)}>
                  {num} người
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {loading && (
          <Typography sx={{ color: "text.primary", p: 2 }}>
            Đang tải dữ liệu...
          </Typography>
        )}
        {error && (
          <Typography sx={{ color: "text.primary", p: 2 }}>{error}</Typography>
        )}

        {selectedSchedule && (
          <>
            {loading && (
              <Typography sx={{ color: "text.primary", p: 2 }}>
                Đang tải phòng...
              </Typography>
            )}
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
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          color: "text.primary",
                        }}
                      >
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
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
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
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1.5,
                              fontWeight: "medium",
                              fontSize: "0.875rem",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <BedDouble size={16} className="text-teal-600" />
                              <p className="mb-0 ">{room.area} m²</p>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <User size={16} className="text-teal-600" />
                              <p className="mb-0">
                                {room.max_people || 0} người
                              </p>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              {room.roomTypeId && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <Building
                                    size={16}
                                    className="text-teal-600"
                                  />
                                  <p className="mb-0">
                                    {room.roomTypeId.type || "Phòng tiêu chuẩn"}
                                  </p>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1,
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "primary.main",
                                fontSize: "1.125rem",
                                fontWeight: "bold",
                              }}
                            >
                              {room.price.toLocaleString()}đ
                            </Typography>
                            <Typography
                              sx={{
                                color: "primary.main",
                                fontSize: "1.125rem",
                                fontWeight: "medium",
                              }}
                            >
                              {" "}
                              / khách
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            border: (theme) =>
                              `1px solid ${theme.palette.divider}`,
                            borderRadius: (theme) =>
                              theme.shape.borderRadius / 2,
                            bgcolor: "background.paper",
                            boxShadow: (theme) => theme.shadows[1],
                          }}
                        >
                          <Button
                            onClick={() =>
                              dispatch(decrementRoomQuantity(room.id))
                            }
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
                          <Typography
                            sx={{
                              mx: 1,
                              width: "auto",
                              textAlign: "center",
                              color: "text.primary",
                            }}
                          >
                            {room.quantity}
                          </Typography>
                          <Button
                            onClick={() =>
                              dispatch(incrementRoomQuantity(room.id))
                            }
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
                {rooms.some((room) => room.quantity > 0) && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      onClick={() => setShowServiceModal(true)}
                      variant="outlined"
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        borderRadius: "20px",
                        textTransform: "none",
                        fontSize: "1rem",
                        borderColor: (theme) => theme.palette.purple.main,
                        color: (theme) => theme.palette.purple.main,
                        mr: 2,
                        width: "fit-content",
                        height: "fit-content",
                      }}
                    >
                      Chọn dịch vụ
                    </Button>
                    <Box
                      sx={{
                        border: "1px solid white",
                        width: "fit-content",
                        p: 1,
                        borderRadius: (theme) => theme.shape.borderRadius / 6,
                        boxShadow: (theme) => theme.shadows[1],
                        bgcolor: "background.paper",
                      }}
                    >
                      {rooms
                        .filter((room) => room.quantity > 0)
                        .map((room) => {
                          const roomTotal = room.price * room.quantity;
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
                                {roomTotal.toLocaleString()}đ (
                                {room.price.toLocaleString()}đ/phòng)
                              </Typography>
                            </Box>
                          );
                        })}
                      {/* Hiển thị dịch vụ đã chọn */}
                      {selectedYachtServices.length > 0 && (
                        <Box>
                          {selectedYachtServices.map((sv, idx) => (
                            <Box
                              key={sv.id || idx}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                fontWeight: "semibold",
                                justifyContent: "space-between",
                                fontSize: "1rem",
                                color: "text.secondary",
                                fontFamily: "Archivo, sans-serif",
                              }}
                            >
                              <Box>
                                Dịch vụ: {sv.serviceName}:{" "}
                                {sv.price.toLocaleString()}đ x{" "}
                                {rooms.reduce(
                                  (acc, room) => acc + room.quantity,
                                  0
                                )}{" "}
                                khách ={" "}
                                {(
                                  sv.price *
                                  rooms.reduce(
                                    (acc, room) => acc + room.quantity,
                                    0
                                  )
                                ).toLocaleString()}
                                đ
                              </Box>
                              <X
                                size={16}
                                style={{
                                  cursor: "pointer",
                                  color: "#e57373",
                                  border: "1px solid #e57373",
                                  borderRadius: "50%",
                                  padding: "2px",
                                }}
                                onClick={() => {
                                  dispatch(
                                    setSelectedYachtServices(
                                      selectedYachtServices.filter(
                                        (item, i) =>
                                          (item.id || i) !== (sv.id || idx)
                                      )
                                    )
                                  );
                                }}
                              />
                            </Box>
                          ))}
                        </Box>
                      )}
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
                          {rooms
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
                          {totalServicePrice.toLocaleString()} đ
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
                <Box
                  sx={{
                    mt: 1,
                    p: 1,
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
                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: "1rem",
                        fontWeight: "medium",
                      }}
                    >
                      Tổng tiền:
                    </Typography>
                    <Typography
                      sx={{
                        color: "primary.main",
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                      }}
                    >
                      {totalPrice.toLocaleString()} đ
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
                      <span
                        style={{
                          fontSize: "1.05rem",
                          fontWeight: "semibold",
                          fontFamily: "Archivo, sans-serif",
                        }}
                      >
                        Đặt ngay
                      </span>
                      <Box
                        component="svg"
                        sx={{ width: 16, height: 16, fill: "currentColor" }}
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M5 12h14M12 5l7 7-7 7"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
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
        selectedYachtServices={selectedYachtServices}
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
        // Truyền scheduleObj vào confirmationData khi mở modal
        scheduleObj={(() => {
          // Lấy schedules cho yacht hiện tại từ object
          const yachtKey = yachtData?._id || yachtData;
          const schedulesForYacht = schedules[yachtKey] || [];
          return getScheduleById(schedulesForYacht, selectedSchedule);
        })()}
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

      <RoomServicesModal
        show={showServiceModal}
        yachtId={yachtId}
        onClose={() => setShowServiceModal(false)}
        onSelectServices={handleSelectYachtServices}
        selectedServices={selectedYachtServices}
      />
    </div>
  );
}

export default RoomSelector;
