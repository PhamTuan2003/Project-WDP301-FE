import { useState, useEffect } from "react";
import axios from "axios";
import ReviewHeader from "./Reviews/ReviewHeader";
import ReviewList from "./Reviews/ReviewList";
import ReviewForm from "./Reviews/ReviewForm";
import ReviewPagination from "./Reviews/ReviewPagination";
import RatingOverview from "./Reviews/RatingOverview";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";

export default function ReviewSection({ yachtId }) {
  const [reviews, setReviews] = useState([]);
  const [ratingData, setRatingData] = useState({
    total: 0,
    average: 0,
    distribution: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");
    console.log("Stored customer from localStorage:", storedCustomer); // Debug
    if (storedCustomer) {
      try {
        const parsedCustomer = JSON.parse(storedCustomer);
        console.log("Parsed customer:", parsedCustomer); // Debug
        setCustomer(parsedCustomer);
      } catch (err) {
        console.error("Error parsing customer from localStorage:", err);
        setError("Không thể đọc thông tin khách hàng từ localStorage");
      }
    } else {
      console.log("No customer found in localStorage");
    }
  }, []);

  const fetchReviews = async (page = 1, searchTerm = "") => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:9999/api/v1/feedback`,
        {
          params: { yachtId, page, limit: 5, search: searchTerm },
        }
      );

      if (response.data.success) {
        setReviews(response.data.data.reviews);
        setRatingData(response.data.data.ratingData);
        setCurrentPage(response.data.data.currentPage);
        setTotalPages(response.data.data.totalPages);
      } else {
        setError("Failed to load reviews");
      }
    } catch (err) {
      setError("Error fetching reviews");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (yachtId) {
      fetchReviews(currentPage, search);
    }
  }, [yachtId, currentPage, search]);

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    setCurrentPage(1);
  };

  return (
    <div className="my-6 pt-6">
      <ReviewHeader
        totalReviews={ratingData.total}
        onSearch={handleSearch}
        isAuthenticated={!!customer}
      />
      <Image src="../icons/heading-border.webp" className="pt-5" />
      <div className="border-gray-300 mb-6 pt-4">
        {loading && <div>Đang tải đánh giá...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <RatingOverview ratingData={ratingData} />
        <ReviewList reviews={reviews} />
        <div className="flex items-center justify-between">
          <Box
            className="text-sm "
            sx={{ color: (theme) => theme.palette.text.secondary }}
          >
            Đang xem:{" "}
            <span className="font-medium rounded-full border-2 border-gray-300 px-3 py-2">
              {reviews.length}
            </span>{" "}
            của <span className="font-medium">{ratingData.total}</span>
          </Box>
          <ReviewPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
        <hr className="p-2" />
        {customer ? (
          <ReviewForm
            yachtId={yachtId}
            customer={customer}
            onSubmitSuccess={() => fetchReviews(1, search)}
          />
        ) : (
          <div className="text-center text-gray-600 py-4">
            Vui lòng{" "}
            <Link to="/login" className="text-teal-500 underline">
              đăng nhập
            </Link>{" "}
            để gửi đánh giá.
          </div>
        )}
      </div>
    </div>
  );
}
