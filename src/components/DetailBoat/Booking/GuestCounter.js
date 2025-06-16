import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Minus, Plus } from "lucide-react";
import { Box, Typography, Button } from "@mui/material";
import { setGuestCounterOpen, updateAdults, updateChildren } from "../../../redux/actions/bookingActions";

const GuestCounter = ({ maxPeople }) => {
  const dispatch = useDispatch();
  const {
    guestCounter: { isOpen, adults, childrenUnder10 = 0, childrenAbove10 = 0 },
    bookingForm: { guestCount },
  } = useSelector((state) => state.booking);

  const [error, setError] = useState("");

  const totalGuests = adults + Math.ceil(childrenAbove10 / 2);
  const overLimit = maxPeople && totalGuests > maxPeople;

  const handleUpdateAdults = (delta) => {
    if (delta > 0 && maxPeople && adults + delta + Math.ceil(childrenAbove10 / 2) > maxPeople) {
      setError(
        `Tổng số khách không được vượt quá sức chứa tối đa (${maxPeople}) của các phòng đã chọn. 2 trẻ em trên 10 tuổi tính là 1 người lớn.`
      );
      return;
    }
    setError("");
    dispatch(updateAdults(delta));
  };
  const handleUpdateChildrenUnder10 = (delta) => {
    if (delta > 0 && childrenUnder10 + delta > 20) {
      setError("Nếu muốn nhiều hơn cần liên lạc với tư vấn viên.");
      return;
    }
    setError("");
    dispatch({ type: "UPDATE_CHILDREN_UNDER_10", payload: delta });
  };
  const handleUpdateChildrenAbove10 = (delta) => {
    if (delta > 0 && maxPeople && adults + Math.ceil((childrenAbove10 + delta) / 2) > maxPeople) {
      setError(
        `Tổng số khách không được vượt quá sức chứa tối đa (${maxPeople}) của các phòng đã chọn. 2 trẻ em trên 10 tuổi tính là 1 người lớn.`
      );
      return;
    }
    setError("");
    dispatch({ type: "UPDATE_CHILDREN_ABOVE_10", payload: delta });
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        onClick={() => dispatch(setGuestCounterOpen(!isOpen))}
        sx={{
          bgcolor: "background.paper",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: (theme) => theme.shape.borderRadius / 5,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          boxShadow: (theme) => theme.shadows[1],
          "&:hover": { borderColor: "primary.main" },
        }}
      >
        <Typography sx={{ color: "text.primary" }}>{guestCount}</Typography>
        <Box
          component="svg"
          sx={{
            width: 20,
            height: 20,
            color: "text.secondary",
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </Box>
      </Box>
      {isOpen && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            mt: 1,
            bgcolor: "background.paper",
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: (theme) => theme.shape.borderRadius / 5,
            boxShadow: (theme) => theme.shadows[1],
            p: 3,
            zIndex: 50,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography sx={{ fontWeight: "medium", color: "text.primary" }}>Người lớn</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                onClick={() => handleUpdateAdults(-1)}
                disabled={adults <= 1}
                sx={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  color: "text.primary",
                  "&:hover": { bgcolor: "background.default" },
                  "&:disabled": { opacity: 0.5 },
                }}
              >
                <Minus size={16} />
              </Button>
              <Typography sx={{ mx: 2, width: 16, textAlign: "center", color: "text.primary" }}>{adults}</Typography>
              <Button
                onClick={() => handleUpdateAdults(1)}
                sx={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  color: "text.primary",
                  "&:hover": { bgcolor: "background.default" },
                }}
              >
                <Plus size={16} />
              </Button>
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography sx={{ fontWeight: "medium", color: "text.primary" }}>
              Trẻ em <span style={{ color: "error.main", fontSize: "0.75rem" }}>(dưới 10 tuổi)</span>
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                onClick={() => handleUpdateChildrenUnder10(-1)}
                disabled={childrenUnder10 <= 0}
                sx={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  color: "text.primary",
                  "&:hover": { bgcolor: "background.default" },
                  "&:disabled": { opacity: 0.5 },
                }}
              >
                <Minus size={16} />
              </Button>
              <Typography sx={{ mx: 2, width: 16, textAlign: "center", color: "text.primary" }}>
                {childrenUnder10}
              </Typography>
              <Button
                onClick={() => handleUpdateChildrenUnder10(1)}
                sx={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  color: "text.primary",
                  "&:hover": { bgcolor: "background.default" },
                }}
              >
                <Plus size={16} />
              </Button>
            </Box>
          </Box>
          <Typography sx={{ fontSize: "0.75rem", color: "error.main", ml: 1, mb: 1 }}>
            Không tính vào tổng sức chứa (tối đa 20)
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography sx={{ fontWeight: "medium", color: "text.primary" }}>
              Trẻ em <span style={{ color: "error.main", fontSize: "0.75rem" }}>(từ 10 tuổi)</span>
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                onClick={() => handleUpdateChildrenAbove10(-1)}
                disabled={childrenAbove10 <= 0}
                sx={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  color: "text.primary",
                  "&:hover": { bgcolor: "background.default" },
                  "&:disabled": { opacity: 0.5 },
                }}
              >
                <Minus size={16} />
              </Button>
              <Typography sx={{ mx: 2, width: 16, textAlign: "center", color: "text.primary" }}>
                {childrenAbove10}
              </Typography>
              <Button
                onClick={() => handleUpdateChildrenAbove10(1)}
                sx={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  color: "text.primary",
                  "&:hover": { bgcolor: "background.default" },
                }}
              >
                <Plus size={16} />
              </Button>
            </Box>
          </Box>
          <Typography sx={{ fontSize: "0.75rem", color: "error.main", ml: 1, mb: 1 }}>
            2 trẻ em từ 10 tuổi tính là 1 người lớn
          </Typography>
          {error && (
            <Typography sx={{ color: "error.main", fontSize: "0.75rem", mt: 1, fontWeight: "medium" }}>
              {error}
            </Typography>
          )}
          {overLimit && (
            <Typography sx={{ color: "error.main", fontSize: "0.75rem", mt: 1, fontWeight: "medium" }}>
              Tổng số khách không được vượt quá sức chứa tối đa ({maxPeople}) của các phòng đã chọn. 2 trẻ em tính là 1
              người lớn.
            </Typography>
          )}
          <Box sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}`, my: 1 }} />
          <Button
            onClick={() => {
              let guestCountText = `${adults} người lớn`;
              if (childrenAbove10 > 0) guestCountText += `, ${childrenAbove10} trẻ em từ 10 tuổi`;
              if (childrenUnder10 > 0)
                guestCountText += `, ${childrenUnder10} trẻ em dưới 10 tuổi (không tính vào tổng khách)`;
              dispatch({
                type: "UPDATE_BOOKING_FORM",
                payload: { field: "guestCount", value: guestCountText },
              });
              dispatch(setGuestCounterOpen(false));
            }}
            variant="contained"
            sx={{
              width: "100%",
              py: 1.5,
              mt: 2,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              borderRadius: (theme) => theme.shape.borderRadius / 2,
              fontWeight: "medium",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Áp dụng
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default GuestCounter;
