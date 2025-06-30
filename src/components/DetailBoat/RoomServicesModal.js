import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { fetchServices } from "../../redux/asyncActions/servicesAsyncActions";

const RoomServicesModal = ({
  show,
  yachtId,
  onClose,
  onSelectServices,
  selectedServices = [],
}) => {
  const dispatch = useDispatch();
  const services = useSelector((state) => state.services.data) || [];
  const servicesLoading = useSelector((state) => state.services.loading);
  const [selected, setSelected] = useState([]);

  const getServiceId = (service, idx) =>
    (service._id || service.id || idx) + "";

  useEffect(() => {
    if (show && yachtId && services.length === 0 && !servicesLoading) {
      dispatch(fetchServices(yachtId));
    }
    if (show) {
      if (selectedServices && selectedServices.length > 0) {
        const selectedIds = selectedServices.map(
          (sv) => (sv._id || sv.id) + ""
        );
        setSelected(selectedIds);
      } else {
        setSelected([]);
      }
    }
  }, [show, selectedServices, yachtId]);

  const handleToggleService = (service, idx) => {
    const id = getServiceId(service, idx);
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const totalServicePrice = services
    .map((serviceObj, idx) => serviceObj.serviceId || serviceObj)
    .filter((service, idx) => selected.includes(getServiceId(service, idx)))
    .reduce((sum, sv) => sum + (sv.price || 0), 0);

  if (!show) return null;

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
          maxWidth: "45rem",
          width: "100%",
          mx: 2,
          maxHeight: "70vh",
          p: 3,
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
            mb: 2,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "text.primary",
              fontFamily: "Archivo, sans-serif",
            }}
          >
            Chọn dịch vụ cho du thuyền
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            fontFamily={"Archivo, sans-serif"}
            sx={{
              fontSize: "1.125rem",
              fontWeight: "bold",
              color: "text.secondary",
              fontFamily: "Archivo, sans-serif",
            }}
          >
            Dịch vụ thêm:
          </Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            {[0, 1].map((colIdx) => (
              <Box
                key={colIdx}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {services
                  .slice(colIdx * 4, colIdx * 4 + 4)
                  .map((serviceObj, idx) => {
                    const service = serviceObj.serviceId || serviceObj;
                    const id = getServiceId(service, colIdx * 4 + idx);
                    return (
                      <FormControlLabel
                        key={id}
                        control={
                          <Checkbox
                            checked={selected.includes(id)}
                            onChange={() =>
                              handleToggleService(service, colIdx * 4 + idx)
                            }
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
                              borderBottom: "1px solid #eee",
                              p: 1,
                              borderRadius: 1,
                              bgcolor: "#fafafa",
                            }}
                          >
                            <span>
                              {serviceObj.serviceName ||
                                serviceObj.name ||
                                "Dịch vụ"}
                            </span>
                            <span style={{ color: "#14b8a6", fontWeight: 500 }}>
                              {(
                                (serviceObj.serviceId &&
                                  serviceObj.serviceId.price) ||
                                serviceObj.price ||
                                0
                              ).toLocaleString()}{" "}
                              đ
                            </span>
                          </Box>
                        }
                      />
                    );
                  })}
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            pt: 2,
            mt: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              fontFamily={"Archivo, sans-serif"}
              sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
            >
              Tổng dịch vụ: {totalServicePrice.toLocaleString()} đ
            </Typography>
            <Button
              onClick={() => {
                const selectedObjs = services
                  .map((serviceObj, idx) => serviceObj.serviceId || serviceObj)
                  .filter((service, idx) =>
                    selected.includes(getServiceId(service, idx))
                  )
                  .map((service, idx) => ({
                    ...service,
                    serviceId:
                      service._id ||
                      service.serviceId ||
                      service.id ||
                      getServiceId(service, idx),
                    _id:
                      service._id ||
                      service.serviceId ||
                      service.id ||
                      getServiceId(service, idx),
                  }));
                onSelectServices(selectedObjs);
                onClose();
              }}
              variant="contained"
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                px: 3,
                py: 1,
                borderRadius: 3,
                fontFamily: "Archivo, sans-serif",
                fontWeight: 500,
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              Chọn dịch vụ
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RoomServicesModal;
