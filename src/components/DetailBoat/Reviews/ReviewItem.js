// components/ReviewItem.jsx
import { Box } from "@mui/material";
import StarRating from "./StarRating";

const ReviewItem = ({ review }) => {
  return (
    <Box
      className="p-7 rounded-3xl shadow-lg  mb-4"
      sx={{
        bgcolor: (theme) => theme.palette.background.paper,
        borderColor: (theme) => theme.palette.divider,
        boxShadow: (theme) => theme.shadows[1],
        color: (theme) => theme.palette.text.primary,
        "&:hover": {
          boxShadow: (theme) => theme.shadows[3],
        },
        transition: "box-shadow 0.3s ease",
      }}
    >
      <div className="flex items-center mb-2">
        <StarRating rating={review.rating} />
      </div>
      <div className="font-medium my-3 ">{review.userName}</div>
      {review.tag && <div className="text-sm  mb-1">{review.tag}</div>}
      <div className="text-sm my-3 mb-1">{review.comment}</div>
      <div className="text-xs ">{review.date}</div>
    </Box>
  );
};

export default ReviewItem;
