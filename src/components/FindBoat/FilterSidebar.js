import React, { useState, useEffect } from "react";
import { Box, Button, Checkbox, Divider, FormControlLabel, FormGroup, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";

const FilterSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
}));

const FilterSidebar = ({
  selectedStars,
  setSelectedStars,
  selectedDurations,
  setSelectedDurations,
  selectedServices,
  setSelectedServices,
  serviceShowCount,
  setServiceShowCount,
  availableServices,
  availableDurations,
  setCurrentPage,
  onClearFilters,
}) => {
  const [enabledStars, setEnabledStars] = useState(new Set());

  // Fetch dữ liệu đánh giá để xác định enabledStars
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const yachtsResponse = await axios.get("http://localhost:9999/api/v1/yachts/findboat");
        const yachts = Array.isArray(yachtsResponse.data?.data) ? yachtsResponse.data.data : [];

        const enabledStarsSet = new Set();
        for (const yacht of yachts) {
          const feedbacksResponse = await axios.get(`http://localhost:9999/api/v1/yachts/${yacht._id}/feedbacks`);
          const feedbacks = feedbacksResponse.data?.data || [];
          const avg =
            feedbacks.length > 0
              ? Math.round((feedbacks.reduce((sum, fb) => sum + (fb.starRating || 0), 0) / feedbacks.length) * 10) / 10
              : 0;
          const roundedStar = Math.round(avg);
          if (roundedStar >= 2 && roundedStar <= 5) {
            enabledStarsSet.add(roundedStar);
          }
        }
        setEnabledStars(enabledStarsSet);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu feedbacks:", err);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleStarFilter = (star) => {
    if (enabledStars.has(star)) {
      setSelectedStars((prev) => (prev.includes(star) ? prev.filter((item) => item !== star) : [...prev, star]));
      setCurrentPage(1);
    }
  };

  const handleDurationFilter = (duration) => {
    setSelectedDurations((prev) =>
      prev.includes(duration) ? prev.filter((item) => item !== duration) : [...prev, duration]
    );
    setCurrentPage(1);
  };

  const handleServiceFilter = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((item) => item !== service) : [...prev, service]
    );
    setCurrentPage(1);
  };

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: "32px",
        border: "1px solid #eaecf0",
        boxShadow: (theme) => theme.shadows[1],
        bgcolor: (theme) => theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          padding: "8px 0",
          borderBottom: (theme) => `1px solid ${theme.palette.divider || "#e0e0e0"}`,
        }}
      >
        <Typography
          variant="h6"
          fontFamily={(theme) => theme.typography.fontFamily}
          fontWeight="bold"
        >
          Lựa chọn
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            mb: 1,
            borderRadius: "20px",
          }}
          onClick={onClearFilters}
        >
          Xóa bộ lọc
        </Button>
      </Box>

      {/* Star rating filter */}
      <Box sx={{ mb: 3, padding: "8px 0" }}>
        <FilterSectionTitle variant="subtitle1">Xếp hạng sao</FilterSectionTitle>
        <FormGroup>
          {[5, 4, 3, 2].map((star) => (
            <FormControlLabel
              key={star}
              control={
                <Checkbox
                  disabled={!enabledStars.has(star)}
                  checked={selectedStars.includes(star)}
                  onChange={() => handleStarFilter(star)}
                  size="small"
                  sx={{
                    color: enabledStars.has(star)
                      ? (theme) => theme.palette.primary.main
                      : (theme) => theme.palette.text.secondary,
                    "&.Mui-checked": {
                      color: (theme) => theme.palette.primary.main,
                    },
                    opacity: enabledStars.has(star) ? 0.6 : 0.4,
                  }}
                />
              }
              label={`${star} sao${!enabledStars.has(star) ? " (hiện tại chưa có)" : ""}`}
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "0.875rem",
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  color: enabledStars.has(star)
                    ? (theme) => theme.palette.text.primary
                    : (theme) => theme.palette.text.secondary,
                },
              }}
            />
          ))}
        </FormGroup>
      </Box>
      <Divider sx={{ my: 2, borderColor: (theme) => theme.palette.divider || "#e0e0e0" }} />{" "}

      {/* Duration filter */}
      <Box sx={{ mb: 3, padding: "8px 0" }}>
        <FilterSectionTitle variant="subtitle1">Thời gian</FilterSectionTitle>
        <FormGroup>
          {availableDurations.map((duration) => (
            <FormControlLabel
              key={duration}
              control={
                <Checkbox
                  checked={selectedDurations.includes(duration)}
                  onChange={() => handleDurationFilter(duration)}
                  size="small"
                  sx={{
                    color: (theme) => theme.palette.primary.main,
                    "&.Mui-checked": {
                      color: (theme) => theme.palette.primary.main,
                    },
                    opacity: 0.6,
                  }}
                />
              }
              label={duration}
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "0.875rem",
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  color: (theme) => theme.palette.text.primary,
                },
              }}
            />
          ))}
        </FormGroup>
      </Box>
      <Divider sx={{ my: 2, borderColor: (theme) => theme.palette.divider || "#e0e0e0" }} />{" "}

      {/* Services filter */}
      <Box sx={{ mb: 3, padding: "8px 0" }}>
        <FilterSectionTitle variant="subtitle1">Dịch vụ</FilterSectionTitle>
        <FormGroup>
          {availableServices.slice(0, serviceShowCount).map((service) => (
            <FormControlLabel
              key={service}
              control={
                <Checkbox
                  checked={selectedServices.includes(service)}
                  onChange={() => handleServiceFilter(service)}
                  size="small"
                  sx={{
                    color: (theme) => theme.palette.primary.main,
                    "&.Mui-checked": {
                      color: (theme) => theme.palette.primary.main,
                    },
                    opacity: 0.6,
                  }}
                />
              }
              label={service}
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "0.875rem",
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  color: (theme) => theme.palette.text.primary,
                },
              }}
            />
          ))}
        </FormGroup>
        {serviceShowCount < availableServices.length && (
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              fontFamily: "Archivo, sans-serif",
              height: "35px",
              borderRadius: "32px",
              bgcolor: "primary.main",
              color: (theme) => theme.palette.getContrastText(theme.palette.primary.main),
              "&:hover": {
                bgcolor: "primary.dark",
              },
              mt: 2,
              fontSize: "0.875rem",
            }}
            onClick={() => setServiceShowCount((prev) => prev + 5)}
          >
            Xem thêm
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default FilterSidebar;
