// App.jsx
import { useState } from "react";
import ReviewHeader from "./Reviews/ReviewHeader";
import { ratingData, reviewsData } from "../../data/reviewData";
import RatingOverview from "./Reviews/RatingOverview";
import ReviewList from "./Reviews/ReviewList";
import ReviewPagination from "./Reviews/ReviewPagination";
import ReviewForm from "./Reviews/ReviewForm";

export default function ReviewSection() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <ReviewHeader totalReviews={ratingData.total} />

      <div className="border-t border-dashed border-gray-300 mb-6 pt-4">
        {/* Rating overview */}
        <RatingOverview ratingData={ratingData} />

        {/* Reviews list */}
        <ReviewList reviews={reviewsData} />

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Đang xem: <span className="font-medium">5</span> / Đủ{" "}
            <span className="font-medium">{ratingData.total}</span>
          </div>
          <ReviewPagination
            currentPage={currentPage}
            totalPages={3}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Review form */}
        <ReviewForm />
      </div>
    </div>
  );
}
