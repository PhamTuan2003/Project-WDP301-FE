import React from "react";
import { User, Minus, Plus, X } from "lucide-react";

function RoomSelector({
  rooms,
  handleDecrement,
  handleIncrement,
  totalAmount,
  handleBookNow,
}) {
  return (
    <div>
      <h2 className="text-4xl font-bold text-gray-900">Các loại phòng & giá</h2>
      <img src="./images/heading-border.webp" alt="Divider" className="my-6" />
      <div
        className="flex flex-col gap-10 p-8 rounded-3xl bg-repeat"
        style={{ backgroundImage: "url('/images/boat-bg.webp')" }}
      >
        <div className="flex justify-end">
          <button className="flex items-center gap-2 capitalize rounded-full px-4 py-2 border bg-gradient-to-t from-slate-50 to-slate-300 text-gray-800 hover:bg-gray-400 hover:shadow-2xl shadow-md">
            <X size={20} />
            <span>Xoá lựa chọn</span>
          </button>
        </div>
        <div className="space-y-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white p-4 rounded-3xl shadow-sm flex justify-between items-center border"
            >
              <div className="flex">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
                <div className="ml-3 flex flex-col items-start gap-2">
                  <h3 className="font-bold text-base underline cursor-pointer text-gray-900">
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
              </div>
              <div className="flex items-center gap-4">
                <div className="text-teal-800 text-lg font-bold">
                  {room.price.toLocaleString()} đ
                </div>
                <div className="text-gray-400 text-xs font-semibold">
                  /khách
                </div>
                <div className="border border-gray-300 rounded-3xl flex items-center">
                  <button
                    onClick={() => handleDecrement(room.id)}
                    className="w-8 h-8 rounded-md flex items-center justify-center"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="mx-3 w-4 text-center">{room.quantity}</span>
                  <button
                    onClick={() => handleIncrement(room.id)}
                    className="w-8 h-8 rounded-md flex items-center justify-center"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-lg p-4 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 font-medium">Tổng tiền</p>
            <p className="text-xl text-teal-800 font-bold">
              {totalAmount.toLocaleString()} đ
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
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
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
    </div>
  );
}

export default RoomSelector;
