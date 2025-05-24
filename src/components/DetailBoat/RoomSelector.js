import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Minus, Plus, X } from "lucide-react";
import { Box } from "@mui/material";

function RoomSelector({
  yachtId,
  handleDecrement,
  handleIncrement,
  totalAmount,
  handleBookNow,
}) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch rooms based on yachtId
  const fetchRooms = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:9999/api/v1/rooms", {
        params: { yachtId: id },
      });

      if (response.data.success) {
        setRooms(response.data.data.rooms);
      } else {
        setError("No rooms found for this yacht");
      }
    } catch (err) {
      setError("Failed to load rooms");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch rooms when yachtId changes
  useEffect(() => {
    if (yachtId) {
      fetchRooms(yachtId);
    } else {
      setRooms([]);
    }
  }, [yachtId]);

  // Update parent component with rooms state
  useEffect(() => {
    if (
      typeof handleDecrement === "function" &&
      typeof handleIncrement === "function"
    ) {
      setRooms((prevRooms) =>
        prevRooms.map((room) => ({
          ...room,
          quantity: room.quantity || 0,
        }))
      );
    }
  }, []);

  const localHandleDecrement = (roomId) => {
    setRooms(
      rooms.map((room) =>
        room.id === roomId && room.quantity > 0
          ? { ...room, quantity: room.quantity - 1 }
          : room
      )
    );
    if (handleDecrement) handleDecrement(roomId);
  };

  const localHandleIncrement = (roomId) => {
    setRooms(
      rooms.map((room) =>
        room.id === roomId ? { ...room, quantity: room.quantity + 1 } : room
      )
    );
    if (handleIncrement) handleIncrement(roomId);
  };

  const handleClearSelection = () => {
    setRooms(rooms.map((room) => ({ ...room, quantity: 0 })));
  };

  return (
    <div>
      <h2 className="text-4xl font-bold light:text-gray-900">
        Các loại phòng & giá
      </h2>
      <img src="../icons/heading-border.webp" alt="Divider" className="my-6" />

      {loading && <div>Đang tải phòng...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && rooms.length === 0 && yachtId && (
        <div>Không tìm thấy phòng cho Yacht ID này</div>
      )}

      {rooms.length > 0 && (
        <div
          className="flex flex-col gap-10 p-8 rounded-3xl bg-repeat"
          style={{ backgroundImage: "url('../images/background2.jpg')" }}
        >
          <div className="flex justify-end">
            <button
              onClick={handleClearSelection}
              className="flex items-center gap-2 capitalize rounded-full px-4 py-2 border bg-gradient-to-t from-slate-50 to-slate-300 text-gray-800 hover:bg-gray-400 hover:shadow-2xl shadow-md"
            >
              <X size={20} />
              <span>Xoá lựa chọn</span>
            </button>
          </div>
          <div className="space-y-4">
            {rooms.map((room) => (
              <Box
                key={room.id}
                className="bg-white p-4 rounded-[30px] shadow-sm flex justify-between items-center border"
                sx={{
                  bgcolor: (theme) => theme.palette.background.paper,
                  borderColor: (theme) => theme.palette.divider,
                  boxShadow: (theme) => theme.shadows[1],
                }}
              >
                <Box
                  className="flex"
                  sx={{ color: (theme) => theme.palette.text.primary }}
                >
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                  <div className="ml-3 flex flex-col items-start gap-2">
                    <h3 className="font-bold text-base underline cursor-pointer ">
                      {room.name}
                    </h3>
                    <div className="flex items-center text-gray-500 gap-4 text-sm">
                      <span className="flex items-center mr-4">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-4 h-4 mr-1 fill-current"
                        >
                          <path d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4C2.89,21 2,20.1 2,19V8C2,6.89 2.89,6 4,6H8V4C8,2.89 8.89,2 10,2M14,6V4H10V6H14Z" />
                        </svg>
                        {room.area} m²
                      </span>
                      <span className="flex items-center">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-4 h-4 mr-1 fill-current"
                        >
                          <path d="M19,7H5C3.89,7 3,7.89 3,9V17H5V13H19V17H21V9C21,7.89 20.11,7 19,7M19,11H5V9H19V11Z" />
                        </svg>
                        Tối đa: {room.beds} <User size={15} />
                      </span>
                    </div>
                  </div>
                </Box>
                <div className="flex items-center gap-2">
                  <div className="text-teal-600 text-lg font-bold">
                    {room.price.toLocaleString()} đ
                  </div>
                  <div className="text-gray-400 text-xs font-semibold">
                    /khách
                  </div>
                  <Box
                    className="border border-gray-300 rounded-3xl flex items-center"
                    sx={{
                      bgcolor: (theme) => theme.palette.background.paper,
                      borderColor: (theme) => theme.palette.divider,
                      boxShadow: (theme) => theme.shadows[1],
                    }}
                  >
                    <button
                      onClick={() => localHandleDecrement(room.id)}
                      className="w-8 h-8 rounded-md flex items-center justify-center"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="mx-3 w-4 text-center">
                      {room.quantity}
                    </span>
                    <button
                      onClick={() => localHandleIncrement(room.id)}
                      className="w-8 h-8 rounded-md flex items-center justify-center"
                    >
                      <Plus size={16} />
                    </button>
                  </Box>
                </div>
              </Box>
            ))}
          </div>
          <div className="mt-6 rounded-lg p-4 shadow-sm flex justify-between items-center">
            <div className="flex  items-center gap-2 bg-slate-300 p-3 rounded-2xl">
              <p className="text-base text-gray-500 font-medium">Tổng tiền:</p>
              <p className="text-xl text-teal-800 font-bold">
                {rooms
                  .reduce((sum, room) => sum + room.price * room.quantity, 0)
                  .toLocaleString()}{" "}
                đ
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-white text-gray-800 font-semibold border rounded-full px-4 py-2">
                Thuế trọn tàu
              </button>
              <button
                onClick={handleBookNow}
                className="bg-teal-400 border border-teal-400 text-teal-800 font-semibold rounded-full px-4 py-2 flex items-center hover:bg-teal-800 hover:text-white"
              >
                <span className="mr-1">Đặt ngay</span>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomSelector;
