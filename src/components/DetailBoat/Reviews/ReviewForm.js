// components/ReviewForm.jsx
import { useState } from "react";
import { Send } from "lucide-react";
import StarRating from "./StarRating";
import InputField from "./InputField";

const ReviewForm = () => {
  const [userRating, setUserRating] = useState(0);

  return (
    <div className="mt-4">
      <div className="mb-4">
        <div className="flex mb-1">
          <div className="mr-2">Chất lượng</div>
          <StarRating rating={userRating} size="lg" onClick={setUserRating} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField label="Họ và tên" placeholder="Nhập họ và tên" />
        <InputField
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
          type="tel"
        />
        <InputField
          label="Địa chỉ email"
          placeholder="Nhập email"
          type="email"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-1">
          Đánh giá của bạn *
        </label>
        <textarea
          placeholder="Nhập yêu cầu của bạn"
          rows={5}
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button className="bg-teal-500 text-white px-6 py-2 rounded-full text-sm flex items-center">
          Gửi <Send size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;
