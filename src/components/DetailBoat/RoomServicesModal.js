import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { BedDouble, Minus, Plus, User, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementRoomQuantity,
  incrementRoomQuantity,
} from "../../redux/actions/bookingActions";
import { fetchServices } from "../../redux/asyncActions/servicesAsyncActions";

const RoomServicesModal = ({
  show,
  room,
  yachtId,
  onClose,
  onSelectServices,
  selectedServicesForRoom = [],
}) => {
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.booking.rooms);
  const currentRoom = rooms.find((r) => r.id === room?.id) || room;
  const services = useSelector((state) => state.services.data) || [];
  const servicesLoading = useSelector((state) => state.services.loading);
  const [selectedServices, setSelectedServices] = useState([]);

  const getServiceId = (service, idx) =>
    (service._id || service.id || idx) + "";
  useEffect(() => {
    if (show && yachtId && services.length === 0 && !servicesLoading) {
      dispatch(fetchServices(yachtId));
    }
    if (room && room.id) {
      if (selectedServicesForRoom && selectedServicesForRoom.length > 0) {
        const selectedIds = selectedServicesForRoom.map(
          (sv) => (sv._id || sv.id) + ""
        );
        setSelectedServices(selectedIds);
      } else {
        setSelectedServices([]);
      }
    }
  }, [room?.id, selectedServicesForRoom]);

  const handleToggleService = (service, idx) => {
    const id = getServiceId(service, idx);
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const totalServicePrice = services
    .map((serviceObj, idx) => serviceObj.serviceId || serviceObj)
    .filter((service, idx) =>
      selectedServices.includes(getServiceId(service, idx))
    )
    .reduce((sum, sv) => sum + (sv.price || 0), 0);

  if (!show || !room || !room.id) return null;

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
          maxHeight: "85vh",
          p: 3,
          overflowY: "auto",
          boxShadow: (theme) => theme.shadows[1],
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Box sx={{ width: "50%", p: 1 }}>
            <Box
              component="img"
              src={room.image || room.avatar || "/images/default-room.jpg"}
              alt={room.name || "Room Image"}
              sx={{
                width: "100%",
                height: 400,
                objectFit: "cover",
                borderRadius: (theme) => theme.shape.borderRadius / 4,
              }}
            />
            <Box sx={{ display: "flex", gap: 1 }}></Box>
          </Box>
          <Box sx={{ width: "50%", p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "text.primary",
                }}
              >
                {room.name || "Unknown Room"}
              </Typography>
              <Button
                onClick={onClose}
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "text.primary" },
                  minWidth: 0,
                }}
              >
                <X size={24} />
              </Button>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: "medium",
                    color: "text.secondary",
                    display: "flex",
                    fontFamily: "Archivo, sans-serif",
                    gap: 0.5,
                  }}
                >
                  <BedDouble size={16} /> {room.area || "33"} m²
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: "medium",
                    color: "text.secondary",
                    display: "flex",
                    fontFamily: "Archivo, sans-serif",
                    gap: 0.5,
                    alignItems: "center",
                  }}
                >
                  Tối đa: {room.beds || 0} <User size={16} />
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                fontFamily={"Archivo, sans-serif"}
                sx={{
                  fontSize: "1.125rem",
                  fontWeight: "bold",
                  color: "text.secondary",
                }}
              >
                Dịch vụ thêm:
              </Typography>
            </Box>
            <Box
              sx={{
                py: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  maxHeight: 150,
                  overflowY: "auto",
                  scrollbarWidth: "thin",

                  scrollbarColor: "#bdbdbd #f5f5f5",
                }}
              >
                {services.length === 0 && (
                  <Typography
                    color="text.secondary"
                    fontFamily={"Archivo, sans-serif"}
                  >
                    Không có dịch vụ thêm
                  </Typography>
                )}
                {services.map((serviceObj, idx) => {
                  const service = serviceObj.serviceId || serviceObj;
                  const id = getServiceId(service, idx);
                  return (
                    <FormControlLabel
                      key={id}
                      control={
                        <Checkbox
                          checked={selectedServices.includes(id)}
                          onChange={() => handleToggleService(service, idx)}
                          disabled={currentRoom.quantity === 0}
                        />
                      }
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            width: "100%",
                            fontFamily: "Archivo, sans-serif",
                            borderBottom: "1px solid gray",
                          }}
                        >
                          <span>
                            {service.serviceName || service.name || "Dịch vụ"}
                          </span>
                          <span style={{ color: "#14b8a6", fontWeight: 500 }}>
                            {(service.price || 0).toLocaleString()} đ
                          </span>
                        </Box>
                      }
                    />
                  );
                })}
              </Box>
            </Box>
            {room.description && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  fontFamily={"Archivo, sans-serif"}
                  sx={{ fontSize: "0.875rem", color: "text.secondary" }}
                >
                  {room.description}
                </Typography>
              </Box>
            )}
            <Box
              sx={{
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                pt: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
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
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      minWidth: 20,
                      textAlign: "center",
                      color: "text.primary",
                    }}
                  >
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
                <Box>
                  <Typography
                    fontFamily={"Archivo, sans-serif"}
                    sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
                  >
                    Tổng dịch vụ: {totalServicePrice.toLocaleString()} đ
                  </Typography>
                  <Button
                    onClick={() => {
                      const selectedObjs = services
                        .map(
                          (serviceObj, idx) =>
                            serviceObj.serviceId || serviceObj
                        )
                        .filter((service, idx) =>
                          selectedServices.includes(getServiceId(service, idx))
                        )
                        .map((service, idx) => ({
                          ...service,
                          id:
                            service._id ||
                            service.id ||
                            getServiceId(service, idx),
                        }));
                      onSelectServices(room.id, selectedObjs);
                      onClose();
                    }}
                    variant="contained"
                    sx={{
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      px: 3,
                      py: 1,
                      fontFamily: "Archivo, sans-serif",
                      fontWeight: 500,
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
    </Box>
  );
};

export default RoomServicesModal;
