import { Box } from "@mui/material";
import { BedDouble, Check, Minus, Plus, User, X } from "lucide-react";
import React from "react";
// Component Modal hiển thị thông tin phòng
const RoomModal = ({ show, room, onClose, onIncrement, onDecrement }) => {
  if (!show || !room) return null;

  // Danh sách tiện ích mẫu (có thể lấy từ API)
  const amenities = [
    "Nhìn ra biển",
    "Điều hòa",
    "Sạc điện thoại",
    "Ban công riêng",
    "Wi-Fi",
    "Két an toàn",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Box
        className=" rounded-3xl max-w-4xl w-full mx-4 max-h-[90vh] p-5 overflow-y-auto"
        sx={{
          bgcolor: (theme) => theme.palette.background.paper,
          borderColor: (theme) => theme.palette.divider,
          boxShadow: (theme) => theme.shadows[1],
        }}
      >
        <div className="flex">
          {/* Ảnh phòng */}
          <div className="w-1/2 p-4">
            <img
              src={room.image || room.avatar}
              alt={room.name}
              className="w-full h-80 object-cover rounded-lg"
            />
            {/* Thumbnail images - có thể thêm nếu có nhiều ảnh */}
            <div className="flex mt-2 space-x-2">
              {/* Các ảnh nhỏ nếu có */}
            </div>
          </div>

          {/* Thông tin phòng */}
          <div className="w-1/2 p-4">
            {/* Thông tin cơ bản */}
            <div className="flex justify-between items-center mb-7">
              {" "}
              <h2 className="text-3xl font-bold">{room.name}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <span className="text-sm font-medium flex items-center gap-1 text-gray-600">
                  <BedDouble size={16} /> <p> {room.area || "33"} m²</p>
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium flex gap-1 items-center text-gray-600">
                  <p> Tối đa: {room.beds} </p>
                  <User size={16} className="mr-1" />
                </span>
              </div>
            </div>

            {/* Tiện ích */}
            <div className="my-6">
              <div className="grid grid-cols-2 gap-2">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex  items-center">
                    <Check size={18} className="text-teal-400 mr-1" />
                    <span className="text-base font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mô tả */}
            {room.description && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">{room.description}</p>
              </div>
            )}

            {/* Chọn phòng */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center border rounded-2xl space-x-3">
                  <button
                    onClick={() => onDecrement(room.id)}
                    disabled={room.quantity === 0}
                    className="w-8 h-8  flex items-center justify-center disabled:opacity-50"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-semibold  min-w-[20px] text-center">
                    {room.quantity}
                  </span>
                  <button
                    onClick={() => onIncrement(room.id)}
                    className="w-8 h-8 rounded-full  flex items-center justify-center"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  className="bg-teal-400 text-white px-6 py-2 hover:bg-teal-500"
                  onClick={onClose}
                >
                  Chọn phòng
                </button>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default RoomModal;
