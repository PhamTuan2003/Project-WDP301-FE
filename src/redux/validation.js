export const validateBookingForm = (formData) => {
  const errors = {};

  // Validate required fields
  if (!formData.fullName?.trim()) {
    errors.fullName = "Họ và tên là bắt buộc";
  } else if (formData.fullName.trim().length < 2) {
    errors.fullName = "Họ và tên phải có ít nhất 2 ký tự";
  }

  if (!formData.phoneNumber?.trim()) {
    errors.phoneNumber = "Số điện thoại là bắt buộc";
  } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber.trim())) {
    errors.phoneNumber = "Số điện thoại phải có 10-11 chữ số";
  }

  if (!formData.email?.trim()) {
    errors.email = "Email là bắt buộc";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    errors.email = "Email không hợp lệ";
  }

  if (!formData.checkInDate) {
    errors.checkInDate = "Ngày check-in là bắt buộc";
  } else {
    // Validate date is not in the past
    const selectedDate = new Date(
      formData.checkInDate.split("/").reverse().join("-")
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      errors.checkInDate = "Ngày check-in không thể là ngày trong quá khứ";
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

// Thêm validation cho room selection
export const validateRoomSelection = (rooms, selectedSchedule) => {
  const errors = {};

  if (!selectedSchedule) {
    errors.schedule = "Vui lòng chọn lịch trình";
  }

  const selectedRooms = rooms.filter((room) => room.quantity > 0);
  if (selectedRooms.length === 0) {
    errors.rooms = "Vui lòng chọn ít nhất một phòng";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export const formatPrice = (price) => {
  if (!price || isNaN(price)) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

// Thêm utility function để format date
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  } catch (error) {
    return "Không xác định";
  }
};

// Thêm function để validate email format
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Thêm function để validate phone format
export const isValidPhone = (phone) => {
  return /^[0-9]{10,11}$/.test(phone);
};
