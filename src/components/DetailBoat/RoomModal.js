import { Box, Typography, Button } from "@mui/material";
import { BedDouble, Check, Minus, Plus, User, X } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { decrementRoomQuantity, incrementRoomQuantity } from "../../redux/actions/bookingActions";

const RoomModal = ({ show, room, onClose }) => {
  const dispatch = useDispatch();

  const rooms = useSelector((state) => state.booking.rooms);
  const currentRoom = rooms.find((r) => r.id === room?.id) || room;

  const amenities = ["Nhìn ra biển", "Điều hòa", "Sạc điện thoại", "Ban công riêng", "Wi-Fi", "Két an toàn"];

  if (!show || !room || !room.id) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: (theme) => theme.shape.borderRadius / 4,
          maxWidth: "64rem",
          width: "100%",
          mx: 2,
          maxHeight: "90vh",
          p: 3,
          overflowY: "auto",
          boxShadow: (theme) => theme.shadows[1],
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Box sx={{ width: "50%", p: 2 }}>
            <Box
              component="img"
              src={room.image || room.avatar || "/images/default-room.jpg"}
              alt={room.name || "Room Image"}
              sx={{
                width: "100%",
                height: 320,
                objectFit: "cover",
                borderRadius: (theme) => theme.shape.borderRadius / 4,
              }}
            />
            <Box sx={{ display: "flex", mt: 1, gap: 1 }}></Box>
          </Box>
          <Box sx={{ width: "50%", p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h2" sx={{ fontSize: "1.5rem", fontWeight: "bold", color: "text.primary" }}>
                {room.name || "Unknown Room"}
              </Typography>
              <Button onClick={onClose} sx={{ color: "text.secondary", "&:hover": { color: "text.primary" }, minWidth: 0 }}>
                <X size={24} />
              </Button>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontSize: "0.875rem", fontWeight: "medium", color: "text.secondary", display: "flex", gap: 0.5 }}>
                  <BedDouble size={16} /> {room.area || "33"} m²
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontSize: "0.875rem", fontWeight: "medium", color: "text.secondary", display: "flex", gap: 0.5 }}>
                  Tối đa: {room.beds || 0} <User size={16} />
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Typography sx={{ fontSize: "1.125rem", fontWeight: "bold", color: "text.secondary" }}>
                Các dịch vụ phòng có sẵn &darr;
              </Typography>
            </Box>
            <Box sx={{ my: 3 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                {amenities.map((amenity, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                    <Check size={18} className="text-teal-400 mr-1" />
                    <Typography sx={{ fontSize: "1rem", fontWeight: "medium", color: "text.primary" }}>
                      {amenity}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            {room.description && (
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>{room.description}</Typography>
              </Box>
            )}
            <Box sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}`, pt: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: (theme) => theme.shape.borderRadius / 2,
                    gap: 1,
                  }}
                >
                  <Button
                    onClick={() => dispatch(decrementRoomQuantity(room.id))}
                    disabled={currentRoom.quantity === 0}
                    sx={{
                      minWidth: 32,
                      height: 32,
                      borderRadius: "50%",
                      color: "text.primary",
                      "&:hover": { bgcolor: "background.default" },
                      "&:disabled": { opacity: 0.5 },
                    }}
                  >
                    <Minus size={16} />
                  </Button>
                  <Typography sx={{ fontWeight: "bold", minWidth: 20, textAlign: "center", color: "text.primary" }}>
                    {currentRoom.quantity || 0}
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
                <Button
                  onClick={onClose}
                  variant="contained"
                  sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    px: 3,
                    py: 1,
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                >
                  Chọn phòng
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RoomModal;