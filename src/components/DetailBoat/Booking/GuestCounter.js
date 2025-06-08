import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Minus, Plus } from "lucide-react";
import { Box } from "@mui/material";
import {
  setGuestCounterOpen,
  updateAdults,
  updateChildren,
} from "../../../redux/action";

const GuestCounter = ({ maxPeople }) => {
  const dispatch = useDispatch();
  const {
    guestCounter: { isOpen, adults, childrenUnder10 = 0, childrenAbove10 = 0 },
    bookingForm: { guestCount },
  } = useSelector((state) => state.booking);

  // State cho thông báo lỗi
  const [error, setError] = useState("");

  // Tổng khách thực tế: adults + Math.ceil(childrenAbove10 / 2)
  const totalGuests = adults + Math.ceil(childrenAbove10 / 2);
  const overLimit = maxPeople && totalGuests > maxPeople;

  // Handler
  const handleUpdateAdults = (delta) => {
    if (
      delta > 0 &&
      maxPeople &&
      adults + delta + Math.ceil(childrenAbove10 / 2) > maxPeople
    ) {
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
    if (
      delta > 0 &&
      maxPeople &&
      adults + Math.ceil((childrenAbove10 + delta) / 2) > maxPeople
    ) {
      setError(
        `Tổng số khách không được vượt quá sức chứa tối đa (${maxPeople}) của các phòng đã chọn. 2 trẻ em trên 10 tuổi tính là 1 người lớn.`
      );
      return;
    }
    setError("");
    dispatch({ type: "UPDATE_CHILDREN_ABOVE_10", payload: delta });
  };

  return (
    <div className="relative">
      <Box
        onClick={() => dispatch(setGuestCounterOpen(!isOpen))}
        className="w-full p-4 border border-gray-300 bg-white cursor-pointer flex justify-between rounded-[32px] items-center hover:border-teal-400 transition-colors"
        sx={{
          bgcolor: (theme) => theme.palette.background.paper,
          borderColor: (theme) => theme.palette.divider,
          boxShadow: (theme) => theme.shadows[1],
          color: (theme) => theme.palette.text.primary,
          "&:hover": {
            borderColor: (theme) => theme.palette.primary.main,
          },
        }}
      >
        <span className="text-gray-700">{guestCount}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Box>
      {isOpen && (
        <Box
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-3xl shadow-lg z-50 p-4"
          sx={{
            bgcolor: (theme) => theme.palette.background.paper,
            borderColor: (theme) => theme.palette.divider,
            boxShadow: (theme) => theme.shadows[1],
            color: (theme) => theme.palette.text.primary,
            "&:hover": {
              borderColor: (theme) => theme.palette.primary.main,
            },
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-700 font-medium">Người lớn</span>
            <div className="flex items-center">
              <button
                onClick={() => handleUpdateAdults(-1)}
                disabled={adults <= 1}
                className="w-8 h-8 rounded-l-full border flex items-center justify-center disabled:opacity-50 hover:bg-gray-100 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="mx-3 w-4 text-center">{adults}</span>
              <button
                onClick={() => handleUpdateAdults(1)}
                className="w-8 h-8 rounded-r-full border flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-700 font-medium">
              Trẻ em{" "}
              <span className="text-xs text-red-500">(dưới 10 tuổi)</span>
            </span>
            <div className="flex items-center">
              <button
                onClick={() => handleUpdateChildrenUnder10(-1)}
                disabled={childrenUnder10 <= 0}
                className="w-8 h-8 rounded-l-full border flex items-center justify-center disabled:opacity-50 hover:bg-gray-100 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="mx-3 w-4 text-center">{childrenUnder10}</span>
              <button
                onClick={() => handleUpdateChildrenUnder10(1)}
                className="w-8 h-8 rounded-r-full border flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          <div className="text-xs text-red-500 mb-2 ml-2">
            Không tính vào tổng sức chứa (tối đa 20)
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-700 font-medium">
              Trẻ em <span className="text-xs text-red-500">(từ 10 tuổi)</span>
            </span>
            <div className="flex items-center">
              <button
                onClick={() => handleUpdateChildrenAbove10(-1)}
                disabled={childrenAbove10 <= 0}
                className="w-8 h-8 rounded-l-full border flex items-center justify-center disabled:opacity-50 hover:bg-gray-100 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="mx-3 w-4 text-center">{childrenAbove10}</span>
              <button
                onClick={() => handleUpdateChildrenAbove10(1)}
                className="w-8 h-8 rounded-r-full border flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          <div className="text-xs text-red-500 mb-2 ml-2">
            2 trẻ em từ 10 tuổi tính là 1 người lớn
          </div>
          {error && (
            <div className="text-red-600 text-xs mt-2 font-medium">{error}</div>
          )}
          <hr />
          {overLimit && (
            <div className="text-red-600 text-xs mt-2 font-medium">
              Tổng số khách không được vượt quá sức chứa tối đa ({maxPeople})
              của các phòng đã chọn. 2 trẻ em tính là 1 người lớn.
            </div>
          )}
          <button
            onClick={() => {
              // Cập nhật bookingForm.guestCount khi áp dụng
              let guestCountText = `${adults} người lớn`;
              if (childrenUnder10 > 0)
                guestCountText += `, ${childrenUnder10} trẻ em dưới 10 tuổi`;
              if (childrenAbove10 > 0)
                guestCountText += `, ${childrenAbove10} trẻ em từ 10 tuổi`;
              dispatch({
                type: "UPDATE_BOOKING_FORM",
                payload: { field: "guestCount", value: guestCountText },
              });
              dispatch(setGuestCounterOpen(false));
            }}
            className="w-full py-3 mt-3 bg-teal-400 text-white rounded-3xl font-medium hover:bg-teal-500 transition-colors disabled:opacity-50"
          >
            <p className="mx-auto">Áp dụng</p>
          </button>
        </Box>
      )}
    </div>
  );
};

export default GuestCounter;
