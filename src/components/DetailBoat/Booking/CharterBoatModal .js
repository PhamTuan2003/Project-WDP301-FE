import React, { useState } from "react";
import { X, Calendar, ArrowRight } from "lucide-react";
import { Box, TextField } from "@mui/material";
import GuestCounter from "./GuestCounter";
import Swal from "sweetalert2";

const CharterBoatModal = ({ show, onClose, yachtData }) => {
  const [formData, setFormData] = useState({
    checkInDate: "25/05/2025",
    guestCount: "3 Người lớn - 1 - Trẻ em",
    fullName: "",
    phoneNumber: "",
    email: "",
    requirements: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ và tên là bắt buộc";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConsultation = () => {
    if (validateForm()) {
      // Xử lý đăng ký tư vấn
      console.log("Charter boat consultation:", formData);

      Swal.fire({
        icon: "success",
        title: "Đăng ký tư vấn thành công!",
        text: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
        showConfirmButton: false,
        timer: 2000,
      });

      onClose();
    }
  };

  const handleBookNow = () => {
    if (validateForm()) {
      // Xử lý đặt thuê trọn tàu
      console.log("Charter boat booking:", formData);

      Swal.fire({
        icon: "success",
        title: "Đặt thuê trọn tàu thành công!",
        text: "Cảm ơn bạn đã đặt dịch vụ. Chúng tôi sẽ xác nhận đặt chỗ sớm nhất.",
        showConfirmButton: false,
        timer: 2000,
      });

      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Box
        className=" rounded-3xl max-w-4xl mt-16 w-full mx-4 max-h-[80vh] p-5 overflow-y-auto"
        sx={{
          bgcolor: (theme) => theme.palette.background.paper,
          borderColor: (theme) => theme.palette.divider,
          boxShadow: (theme) => theme.shadows[1],
        }}
      >
        {" "}
        {/* Header */}
        <div className="flex justify-between items-center p-3 border-b">
          <h2 className="text-xl font-bold text-gray-800">Thuê trọn tàu</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Date and Guest Selection */}
          <div className="grid grid-cols-2 gap-3">
            {/* Check-in Date */}
            <TextField
              fullWidth
              label="Ngày nhận phòng"
              type="date"
              value={
                formData.checkInDate
                  ? formData.checkInDate.split("/").reverse().join("-")
                  : ""
              }
              onChange={(e) => {
                // Convert yyyy-mm-dd to dd/mm/yyyy
                const val = e.target.value;
                const formatted =
                  val && val.includes("-")
                    ? val.split("-").reverse().join("/")
                    : val;
                handleInputChange("checkInDate", formatted);
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              sx={{
                fontFamily: "Archivo, sans-serif",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "32px",

                  fontFamily: "Archivo, sans-serif",
                  "& fieldset": {
                    borderColor: "#d1d5db",
                  },
                  "&:hover fieldset": {
                    borderColor: "#14b8a6",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#14b8a6",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#374151",
                  "&.Mui-focused": {
                    color: "#14b8a6",
                  },
                },
              }}
            />

            <GuestCounter
              value={formData.guestCount}
              onChange={(val) => handleInputChange("guestCount", val)}
            />
          </div>
          <TextField
            fullWidth
            label="Họ và tên"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            error={!!errors.fullName}
            helperText={errors.fullName}
            required
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px",

                "& fieldset": {
                  borderColor: "#d1d5db",
                },
                "&:hover fieldset": {
                  borderColor: "#14b8a6",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#14b8a6",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#374151",
                fontFamily: "Archivo, sans-serif",
                "&.Mui-focused": {
                  color: "#14b8a6",
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Số điện thoại"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            required
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px",
                fontFamily: "Archivo, sans-serif",
                "& fieldset": {
                  borderColor: "#d1d5db",
                },
                "&:hover fieldset": {
                  borderColor: "#14b8a6",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#14b8a6",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#374151",
                fontFamily: "Archivo, sans-serif",
                "&.Mui-focused": {
                  color: "#14b8a6",
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Địa chỉ email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            required
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px",
                fontFamily: "Archivo, sans-serif",
                "& fieldset": {
                  borderColor: "#d1d5db",
                },
                "&:hover fieldset": {
                  borderColor: "#14b8a6",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#14b8a6",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#374151",
                fontFamily: "Archivo, sans-serif",
                "&.Mui-focused": {
                  color: "#14b8a6",
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Yêu cầu của bạn"
            placeholder="Nhập yêu cầu của bạn"
            multiline
            rows={4}
            value={formData.requirements}
            onChange={(e) => handleInputChange("requirements", e.target.value)}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px",
                fontFamily: "Archivo, sans-serif",
                "& fieldset": {
                  borderColor: "#d1d5db",
                },
                "&:hover fieldset": {
                  borderColor: "#14b8a6",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#14b8a6",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#374151",
                fontFamily: "Archivo, sans-serif",
                "&.Mui-focused": {
                  color: "#14b8a6",
                },
              },
            }}
          />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={handleConsultation}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-3xl 
                       hover:bg-gray-50 font-medium transition-colors"
            >
              <p className="flex items-center mx-auto justify-center gap-2">
                Đăng ký tư vấn
              </p>
            </button>
            <button
              onClick={handleBookNow}
              className="flex-1 py-3 px-4 bg-teal-400 text-white rounded-3xl 
                       hover:bg-teal-500 font-medium  transition-colors"
            >
              <p className="flex items-center mx-auto justify-center gap-2">
                Đặt ngay <ArrowRight />{" "}
              </p>
            </button>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default CharterBoatModal;
