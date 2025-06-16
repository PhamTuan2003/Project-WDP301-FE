import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Avatar, Stack, IconButton } from "@mui/material";
import styled from "@emotion/styled";
import axios from "axios";
import Swal from "sweetalert2";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { isValidPhone, isValidEmail } from "../../redux/validation"; // Import hàm validate

const StyledButton = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  textTransform: "none",
  fontSize: "1rem",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const Input = styled("input")({
  display: "none",
});

export default function CustomerProfile() {
  const [customer, setCustomer] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    avatar: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");
    if (storedCustomer) {
      const parsedCustomer = JSON.parse(storedCustomer);
      setCustomer(parsedCustomer);
      setFormData({
        fullName: parsedCustomer.fullName || "",
        email: parsedCustomer.email || "",
        phoneNumber: parsedCustomer.phoneNumber || "",
        avatar: parsedCustomer.avatar || null,
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isValidPhone(formData.phoneNumber)) {
      setError("Số điện thoại phải bắt đầu bằng 0 hoặc +84, theo sau là đầu số hợp lệ (03, 05, 07, 08, 09) và 7 chữ số, tổng cộng 10 chữ số");
      return;
    }

    try {
      const updateData = { phoneNumber: formData.phoneNumber };
      if (customer.accountId) {
        updateData.fullName = formData.fullName;
        updateData.email = formData.email;
      }

      const updateResponse = await axios.put(`http://localhost:9999/api/v1/customers/${customer.id}`, updateData);

      if (customer.accountId && formData.avatar && formData.avatar instanceof File) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", formData.avatar);
        const avatarResponse = await axios.put(
          `http://localhost:9999/api/v1/customers/${customer.id}/avatar`,
          avatarFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        updateResponse.data.customer.avatar = avatarResponse.data.customer.avatar;
      }

      const updatedCustomer = {
        ...customer,
        fullName: customer.accountId ? formData.fullName : customer.fullName,
        phoneNumber: formData.phoneNumber,
        email: updateResponse.data.customer.email,
        avatar: updateResponse.data.customer.avatar || customer.avatar,
      };
      localStorage.setItem("customer", JSON.stringify(updatedCustomer));
      setCustomer(updatedCustomer);

      setSuccess("Cập nhật thông tin thành công!");
      setEditMode(false);

      Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        text: "Thông tin cá nhân của bạn đã được cập nhật.",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Cập nhật thông tin thất bại, vui lòng thử lại.");
    }
  };

  if (!customer) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="primary.main">
          Vui lòng đăng nhập để xem thông tin cá nhân.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" align="center" gutterBottom color="primary.main">
        Thông tin cá nhân
      </Typography>

      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="success.main" align="center" sx={{ mb: 2 }}>
          {success}
        </Typography>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Stack direction="column" alignItems="center" spacing={1}>
          <Avatar
            src={formData.avatar instanceof File ? URL.createObjectURL(formData.avatar) : formData.avatar || ""}
            alt="Avatar"
            sx={{ width: 120, height: 120 }}
          />
          {editMode && customer.accountId && (
            <label htmlFor="avatar-upload">
              <Input accept="image/*" id="avatar-upload" type="file" onChange={handleAvatarChange} />
              <IconButton color="primary" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
          )}
        </Stack>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Họ và tên"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            fullWidth
            disabled={!editMode || !customer.accountId}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            disabled={!editMode || !customer.accountId} // ✅ Chỉ cho sửa khi đang edit và là user thường
            error={editMode && customer.accountId && !isValidEmail(formData.email)} // ✅ Chỉ validate khi user thường
            helperText={
              editMode && customer.accountId && !isValidEmail(formData.email)
                ? "Email không hợp lệ, cần Email chính xác để 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 gửi các thông tin như chọn phòng, thông tin hoá đơn, tư vấn, ... Nếu không bạn sẽ không nhận được bất cứ thông tin nào"
                : ""
            }
          />

          <TextField
            label="Số điện thoại"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            error={editMode && !isValidPhone(formData.phoneNumber)}
            helperText={
              editMode && !isValidPhone(formData.phoneNumber)
                ? "Số điện thoại không hợp lệ, nếu sai số điện thoại sẽ không nhận được mã OTP"
                : ""
            }
          />
          {editMode ? (
            <Stack direction="row" spacing={2}>
              <StyledButton type="submit">Lưu thay đổi</StyledButton>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setEditMode(false);
                  setFormData({
                    fullName: customer.fullName || "",
                    email: customer.email || "",
                    phoneNumber: customer.phoneNumber || "",
                    avatar: customer.avatar || null,
                  });
                  setError("");
                  setSuccess("");
                }}
              >
                Hủy
              </Button>
            </Stack>
          ) : (
            <StyledButton onClick={() => setEditMode(true)}>Chỉnh sửa thông tin</StyledButton>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
