import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper,
  Typography,
  Divider,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  styled,
} from "@mui/material";
import {
  setStarFilter,
  setDurationFilter,
  setFeatureFilter,
  setFeatureShowCount,
  setSearchTerm,
  setDeparturePoint,
  setPriceRange,
  setSortOption,
} from "../../redux/action";
import { cruiseData } from "../../data/cruiseData";

const FilterSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
}));

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const {
    selectedStars,
    selectedDurations,
    selectedFeatures,
    featureShowCount,
  } = useSelector((state) => state.filters || {});

  const availableDurations = [
    ...new Set(cruiseData.map((cruise) => cruise.duration).filter(Boolean)),
  ];
  const availableFeatures = [
    ...new Set(
      cruiseData.flatMap((cruise) => cruise.features || []).filter(Boolean)
    ),
  ];

  const handleResetFilters = () => {
    dispatch(setSearchTerm(""));
    dispatch(setStarFilter([]));
    dispatch(setDurationFilter([]));
    dispatch(setFeatureFilter([]));
    dispatch(setDeparturePoint(""));
    dispatch(setPriceRange(""));
    dispatch(setSortOption(""));
    dispatch(setFeatureShowCount(5));
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: "32px",
        border: "1px solid #eaecf0",
        boxShadow:
          "0px 1px 2px 0px rgba(16,24,40,.06), 0px 1px 3px 0px rgba(16,24,40,.1)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          fontFamily="Archivo, sans-serif"
          fontWeight="bold"
        >
          Lọc kết quả
        </Typography>
        <Button
          color="error"
          sx={{
            textTransform: "none",
            fontSize: "0.875rem",
            fontFamily: "Archivo, sans-serif",
          }}
          onClick={handleResetFilters}
        >
          Xóa bộ lọc
        </Button>
      </Box>
      <Divider sx={{ my: 1 }} />

      <Box sx={{ mb: 3 }}>
        <FilterSectionTitle
          fontFamily="Archivo, sans-serif"
          variant="subtitle1"
        >
          Xếp hạng sao
        </FilterSectionTitle>
        <FormGroup>
          {[5, 4, 3].map((star) => (
            <FormControlLabel
              key={star}
              control={
                <Checkbox
                  checked={
                    Array.isArray(selectedStars) && selectedStars.includes(star)
                  }
                  onChange={() => dispatch(setStarFilter(star))}
                  size="small"
                  sx={{ opacity: 0.6 }}
                />
              }
              label={`${star} sao`}
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "0.875rem",
                  fontFamily: "Archivo, sans-serif",
                  fontWeight: 600,
                },
              }}
            />
          ))}
        </FormGroup>
      </Box>
      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <FilterSectionTitle
          fontFamily="Archivo, sans-serif"
          variant="subtitle1"
        >
          Thời gian
        </FilterSectionTitle>
        <FormGroup>
          {availableDurations.map((duration) => (
            <FormControlLabel
              key={duration}
              control={
                <Checkbox
                  checked={
                    Array.isArray(selectedDurations) &&
                    selectedDurations.includes(duration)
                  }
                  onChange={() => dispatch(setDurationFilter(duration))}
                  size="small"
                  sx={{ opacity: 0.6 }}
                />
              }
              label={duration}
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "0.875rem",
                  fontFamily: "Archivo, sans-serif",
                  fontWeight: 600,
                },
              }}
            />
          ))}
        </FormGroup>
      </Box>
      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <FilterSectionTitle
          fontFamily="Archivo, sans-serif"
          variant="subtitle1"
        >
          Tiện ích
        </FilterSectionTitle>
        <FormGroup>
          {availableFeatures.slice(0, featureShowCount).map((feature) => (
            <FormControlLabel
              key={feature}
              control={
                <Checkbox
                  checked={
                    Array.isArray(selectedFeatures) &&
                    selectedFeatures.includes(feature)
                  }
                  onChange={() => dispatch(setFeatureFilter(feature))}
                  size="small"
                  sx={{ opacity: 0.6 }}
                />
              }
              label={feature}
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "0.875rem",
                  fontFamily: "Archivo, sans-serif",
                  fontWeight: 600,
                },
              }}
            />
          ))}
        </FormGroup>
        {featureShowCount < availableFeatures.length && (
          <Button
            color="primary"
            sx={{
              textTransform: "none",
              fontSize: "0.875rem",
              fontFamily: "Archivo, sans-serif",
              mt: 2,
              height: "30px",
              borderRadius: "32px",
              bgcolor: "#fff",
              border: "1px solid #eaecf0",
              color: "#333",
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
            onClick={() => dispatch(setFeatureShowCount(featureShowCount + 5))}
          >
            Xem thêm
          </Button>
        )}
      </Box>
    </Paper>
  );
};
export default FilterSidebar;
