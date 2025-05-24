import { useState } from "react";
import { Send } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import StarRating from "./StarRating";
import { Box, TextField } from "@mui/material";

const ReviewForm = ({ yachtId, customer, onSubmitSuccess }) => {
  const [userRating, setUserRating] = useState(0);
  const [fullName] = useState(customer?.fullName || "");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const customerId = customer?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Debug: Log all values
    console.log("Submitting review with:", {
      userRating,
      fullName,
      description,
      customerId,
      yachtId,
    });

    // Validation
    let errorMessage = "";
    if (userRating < 1 || userRating > 5) {
      errorMessage += "Vui lòng chọn số sao từ 1 đến 5. ";
    }
    if (!fullName) errorMessage += "Họ và tên không được để trống. ";
    if (!description) errorMessage += "Nhận xét không được để trống. ";
    if (!customerId) errorMessage += "ID khách hàng không hợp lệ. ";
    if (!yachtId) errorMessage += "ID du thuyền không hợp lệ. ";

    if (errorMessage) {
      Swal.fire({
        title: "Lỗi!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực.");
      }

      const response = await axios.post(
        "http://localhost:9999/api/v1/feedback",
        {
          starRating: userRating,
          description,
          customerId,
          yachtId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        Swal.fire({
          title: "Thành công!",
          text: "Đánh giá của bạn đã được gửi.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setUserRating(0);
        setDescription("");
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      Swal.fire({
        title: "Lỗi!",
        text:
          error.response?.data?.message ||
          "Không thể gửi đánh giá, vui lòng thử lại.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-5">
      <div className="py-4 grid grid-cols-2 gap-4">
        <Box
          className="flex border px-3 items-center"
          sx={{
            "& .MuiBox-root": { borderRadius: "32px" },
            "& .MuiBox-root:hover": { borderColor: "#1976d2" },
            borderRadius: "32px",
            border: "1px solid",
            height: "56px",
            display: "flex",
            borderColor: (theme) => theme.palette.divider,
            bgcolor: (theme) => theme.palette.background.paper,
            boxShadow: (theme) => theme.shadows[1],
          }}
        >
          <div className="mr-2 ">Chất lượng:</div>
          <StarRating rating={userRating} size="lg" onClick={setUserRating} />
        </Box>
        <TextField
          label="Họ và tên *"
          value={fullName}
          disabled
          focused
          sx={{
            borderRadius: "32px",
            "& label": { color: "#000" },
            "& label.Mui-focused": { color: "#1976d2" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "32px",
              "& fieldset": { borderColor: "#ccc" },
              "&:hover fieldset": { borderColor: "#1976d2" },
              "&.Mui-focused fieldset": { borderColor: "#1976d2" },
              borderColor: (theme) => theme.palette.divider,
              bgcolor: (theme) => theme.palette.background.paper,
              boxShadow: (theme) => theme.shadows[1],
            },
          }}
          InputProps={{
            style: { borderRadius: "32px" },
          }}
          helperText="Tên được lấy từ tài khoản của bạn"
        />
      </div>
      <div className="mb-4">
        <TextField
          focused
          label="Đánh giá của bạn *"
          placeholder="Nhập đánh giá của bạn"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 text-sm"
          multiline
          rows={5}
          required
          error={description === ""}
          helperText={
            description === ""
              ? "Vui lòng nhập nhận xét"
              : "Bạn phải nhập đánh giá"
          }
          sx={{
            borderRadius: "32px",
            "& label": { color: "#000" },
            "& label.Mui-focused": { color: "#1976d2" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "32px",
              "& fieldset": { borderColor: "#ccc" },
              "&:hover fieldset": { borderColor: "#1976d2" },
              "&.Mui-focused fieldset": { borderColor: "#1976d2" },
              borderColor: (theme) => theme.palette.divider,
              bgcolor: (theme) => theme.palette.background.paper,
              boxShadow: (theme) => theme.shadows[1],
            },
          }}
          InputProps={{
            style: { borderRadius: "32px" },
          }}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#77dada] text-gray-100 hover:bg-[#0e4f4f] hover:text-white px-6 rounded-3xl py-2 text-base font-semibold flex items-center"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi"}{" "}
          <Send size={16} className="ml-2" />
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
