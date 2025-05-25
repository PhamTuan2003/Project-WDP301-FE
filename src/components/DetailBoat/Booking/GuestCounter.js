import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";

const GuestCounter = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [adults, setAdults] = useState(3);
  const [children, setChildren] = useState(1);

  const handleAdultChange = (increment) => {
    const newValue = Math.max(1, adults + increment);
    setAdults(newValue);
    updateValue(newValue, children);
  };

  const handleChildrenChange = (increment) => {
    const newValue = Math.max(0, children + increment);
    setChildren(newValue);
    updateValue(adults, newValue);
  };

  const updateValue = (adultCount, childCount) => {
    const displayValue = `${adultCount} Người lớn - ${childCount} - Trẻ em`;
    if (onChange) onChange(displayValue);
  };

  const handleApply = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Display Field */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 border border-gray-300 bg-white cursor-pointer 
                   flex justify-between rounded-[32px] items-center hover:border-teal-400 transition-colors"
      >
        <span className="text-gray-700">
          {value || `${adults} Người lớn - ${children} - Trẻ em`}
        </span>
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
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 
                        rounded-3xl shadow-lg z-50 p-4"
        >
          {/* Adults Counter */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-700  font-medium">Người lớn</span>
            <div className="flex items-center ">
              <button
                onClick={() => handleAdultChange(-1)}
                disabled={adults <= 1}
                className="w-8 h-8 rounded-l-full border   flex items-center justify-center 
                         disabled:opacity-50 hover:bg-gray-100 transition-colors"
              >
                <Minus size={16} />
              </button>

              <button
                onClick={() => handleAdultChange(1)}
                className="w-8 h-8 rounded-r-full border flex items-center justify-center 
                         hover:bg-gray-100 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Children Counter */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-700 font-medium">Trẻ em</span>
            <div className="flex items-center ">
              <button
                onClick={() => handleChildrenChange(-1)}
                disabled={children <= 0}
                className="w-8 h-8 rounded-l-full border  flex items-center justify-center 
                         disabled:opacity-50 hover:bg-gray-100 transition-colors"
              >
                <Minus size={16} />
              </button>

              <button
                onClick={() => handleChildrenChange(1)}
                className="w-8 h-8 rounded-r-full border flex items-center justify-center 
                         hover:bg-gray-100 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          <hr />
          {/* Apply Button */}
          <button
            onClick={handleApply}
            className="w-full py-3 mt-3 bg-teal-400 text-white rounded-3xl font-medium 
                     hover:bg-teal-500 transition-colors disabled:opacity-50"
          >
            <p className="mx-auto"> Áp dụng</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default GuestCounter;
