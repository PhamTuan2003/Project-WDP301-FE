import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Stack,
  TextField,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import SearchBar from "../components/FindBoat/SearchBar";
import FilterSidebar from "../components/FindBoat/FilterSidebar";
import CruiseCard from "../components/FindBoat/CruiseCard";
import PaginationSection from "../components/FindBoat/PaginationSection";
import { setNoResults, setSortOption } from "../redux/action";
import { cruiseData, priceRanges, sortOptions } from "../data/cruiseData";
import { FilterAltOutlined } from "@mui/icons-material";

const FindBoat = () => {
  const dispatch = useDispatch();
  const {
    searchTerm,
    selectedStars,
    selectedDurations,
    selectedFeatures,
    selectedDeparturePoint,
    selectedPriceRange,
    sortOption,
    currentPage,
    noResults,
  } = useSelector((state) => state.filters || {});

  const itemsPerPage = 5;

  const filteredCruises = useMemo(() => {
    if (!Array.isArray(cruiseData) || cruiseData.length === 0) {
      return [];
    }

    let result = cruiseData.filter((cruise) => cruise && typeof cruise === "object" && cruise.id);

    if (typeof searchTerm === "string" && searchTerm.trim()) {
      result = result.filter((cruise) => cruise.title?.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (Array.isArray(selectedStars) && selectedStars.length > 0) {
      result = result.filter((cruise) => {
        const starRating = cruise.rating >= 9 ? 5 : cruise.rating >= 7 ? 4 : 3;
        return selectedStars.includes(starRating);
      });
    }

    if (Array.isArray(selectedDurations) && selectedDurations.length > 0) {
      result = result.filter((cruise) => selectedDurations.includes(cruise.duration));
    }

    if (Array.isArray(selectedFeatures) && selectedFeatures.length > 0) {
      result = result.filter((cruise) =>
        selectedFeatures.every((feature) => cruise.features?.includes(feature))
      );
    }

    if (typeof selectedDeparturePoint === "string" && selectedDeparturePoint) {
      result = result.filter((cruise) => cruise.departurePoint === selectedDeparturePoint);
    }

    if (typeof selectedPriceRange === "string" && selectedPriceRange && selectedPriceRange !== "all") {
      const selectedRange = priceRanges.find((range) => range.value === selectedPriceRange);
      if (selectedRange) {
        result = result.filter(
          (cruise) => cruise.price >= selectedRange.min && cruise.price <= selectedRange.max
        );
      }
    }

    if (typeof sortOption === "string" && sortOption) {
      result = [...result].sort((a, b) => {
        if (sortOption === "low-to-high") return a.price - b.price;
        if (sortOption === "high-to-low") return b.price - a.price;
        return 0;
      });
    }

    return result;
  }, [
    searchTerm,
    selectedStars,
    selectedDurations,
    selectedFeatures,
    selectedDeparturePoint,
    selectedPriceRange,
    sortOption,
  ]);

  useEffect(() => {
    dispatch(setNoResults(filteredCruises.length === 0));
  }, [dispatch, filteredCruises.length]);

  if (!Array.isArray(cruiseData) || cruiseData.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">Error: No cruise data available</Typography>
      </Container>
    );
  }

  const displayCruises =
    filteredCruises.length === 0
      ? cruiseData.filter((cruise) => cruise && typeof cruise === "object" && cruise.id)
      : filteredCruises;

  const totalPages = Math.max(1, Math.ceil(displayCruises.length / itemsPerPage));
  const validCurrentPage = Math.max(1, Math.min(Number.isInteger(currentPage) ? currentPage : 1, totalPages));

  const indexOfLastItem = validCurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCruises = displayCruises
    .slice(indexOfFirstItem, indexOfLastItem)
    .filter((cruise) => cruise && typeof cruise === "object" && cruise.id);

  const BlueIndicator = () => <Box sx={{ width: "48px", height: "2px", bgcolor: "primary.main", ml: 0.5 }} />;

  return (
    <Box
      sx={{
        backgroundImage: (theme) => (theme.palette.mode === "light" ? "url('https://mixivivu.com/section-background.png')" : "none"),
        backgroundSize: "cover", //light thì có ảnh, dark thì không
        backgroundPosition: "center",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? theme.palette.background.default : "transparent",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: "32px",
            border: "1px solid",
            borderColor: (theme) => theme.palette.divider,
            bgcolor: (theme) => theme.palette.background.paper,
            boxShadow: (theme) => theme.shadows[1],
          }}
        >
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            sx={{ my: 3, fontFamily: "Archivo, sans-serif", color: "text.primary" }}
          >
            Bạn lựa chọn du thuyền Hạ Long nào?
          </Typography>
          <Typography
            align="center"
            color="text.secondary"
            sx={{ mb: 2, fontFamily: "Archivo, sans-serif", opacity: 0.6 }}
          >
            Hơn 100 tour du thuyền hạng sang giá tốt đang chờ bạn
          </Typography>
          <SearchBar />
        </Paper>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            mt: 10,
            fontFamily: "Archivo, sans-serif",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              bgcolor: (theme) => theme.palette.background.paper,
              borderRadius: "32px",
              p: "5px 20px",
              boxShadow: (theme) => theme.shadows[1],
            }}
          >
            <Typography
              fontFamily={"Archivo, sans-serif"}
              variant="h4"
              color="text.primary"
              fontWeight="bold"
            >
              Tìm thấy {filteredCruises.length} kết quả
            </Typography>
            <BlueIndicator />
          </Box>
          <TextField
            select
            value={sortOption}
            onChange={(e) => dispatch(setSortOption(e.target.value))}
            SelectProps={{ displayEmpty: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterAltOutlined color="action" />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{
              minWidth: 180,
              backgroundColor: (theme) => theme.palette.background.paper,
              borderRadius: "32px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px",
                height: "50px",
                fontFamily: "Archivo, sans-serif",
                fontWeight: 500,
                borderColor: (theme) => theme.palette.divider,
                color: "text.primary",
              },
              "& .MuiSelect-icon": { color: "text.primary" },
            }}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value} sx={{ color: "text.primary" }}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <FilterSidebar />
          </Grid>
          <Grid item xs={12} md={9}>
            <Stack spacing={3}>
              {noResults ? (
                <Typography
                  color="error"
                  align="center"
                  sx={{
                    mt: 2,
                    fontFamily: "Archivo, sans-serif",
                    bgcolor: (theme) => theme.palette.background.paper,
                    borderRadius: "32px",
                    width: "fit-content",
                    padding: "3px 20px",
                    boxShadow: (theme) => theme.shadows[1],
                    justifyContent: "center",
                    fontWeight: 500,
                    alignSelf: "center",
                  }}
                >
                  Không tìm thấy du thuyền nào. Vui lòng thử lại với các bộ lọc khác.
                </Typography>
              ) : (
                currentCruises.map((cruise) => <CruiseCard key={cruise.id} cruise={cruise} />)
              )}
            </Stack>
            <PaginationSection
              totalPages={totalPages}
              filteredCruisesLength={displayCruises.length}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FindBoat;
