// components/ReviewItem.jsx
import StarRating from "./StarRating";

const ReviewItem = ({ review }) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg mb-4">
      <div className="flex items-center mb-1">
        <StarRating rating={review.rating} />
      </div>
      <div className="font-medium text-gray-800">{review.userName}</div>
      {review.tag && (
        <div className="text-sm text-gray-600 mb-1">{review.tag}</div>
      )}
      <div className="text-sm text-gray-700 mb-1">{review.comment}</div>
      <div className="text-xs text-gray-500">{review.date}</div>
    </div>
  );
};

export default ReviewItem;
