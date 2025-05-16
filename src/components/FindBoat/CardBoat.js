import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Checkbox,
  Chip,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  Paper,
  Pagination,
  Stack,
  TextField,
  Typography,
  styled,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { FilterAltOutlined, MonetizationOnOutlined, PinDrop, StarOutline } from "@mui/icons-material";
import cruiseData from "../../data/cruiseData.json";

// Styled components
const HotSaleBadge = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "16px",
  left: "0",
  backgroundColor: "#fbbf24",
  color: "white",
  padding: "4px 8px",
  fontSize: "0.75rem",
  fontWeight: "bold",
}));

const FeatureChip = styled(Chip)(({ theme }) => ({
  borderRadius: "16px",
  backgroundColor: "#f3f4f6",
  color: theme.palette.text.secondary,
  fontSize: "0.75rem",
  height: "24px",
}));

const FilterSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
}));

const BlueIndicator = styled("div")(({ theme }) => ({
  width: "48px",
  height: "2px",
  backgroundColor: theme.palette.primary.main,
  marginLeft: theme.spacing(0.5),
}));

const priceRanges = [
  { label: "1-3 triệu", value: "1-3", min: 1000000, max: 3000000 },
  { label: "3-6 triệu", value: "3-6", min: 3000000, max: 6000000 },
  { label: "Hơn 3 triệu", value: "over-3", min: 3000000, max: Infinity },
];
const sortOptions = [
  { label: "Không sắp xếp", value: "" },
  { label: "Giá: Thấp đến cao", value: "low-to-high" },
  { label: "Giá: Cao đến thấp", value: "high-to-low" },
];
// Derive unique features from cruiseData
const availableFeatures = [...new Set(cruiseData.flatMap((cruise) => cruise.features))];

const CardBoat = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [featureShowCount, setFeatureShowCount] = useState(5); // Initial number of features to show
  const [selectedDeparturePoint, setSelectedDeparturePoint] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [sortOption, setSortOption] = useState("");
  const itemsPerPage = 5;

  // Filter handlers
  const handleStarFilter = (star) => {
    setSelectedStars((prev) =>
      prev.includes(star) ? prev.filter((item) => item !== star) : [...prev, star]
    );
  };

  const handleDurationFilter = (duration) => {
    setSelectedDurations((prev) =>
      prev.includes(duration) ? prev.filter((item) => item !== duration) : [...prev, duration]
    );
  };

  const handleFeatureFilter = (feature) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature) ? prev.filter((item) => item !== feature) : [...prev, feature]
    );
  };

  // Filtering logic
  let filteredCruises = cruiseData;

  if (searchTerm) {
    filteredCruises = filteredCruises.filter((cruise) =>
      cruise.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedStars.length > 0) {
    filteredCruises = filteredCruises.filter((cruise) =>
      selectedStars.includes(cruise.rating >= 9 ? 5 : cruise.rating >= 7 ? 4 : 3)
    );
  }

  if (selectedDurations.length > 0) {
    filteredCruises = filteredCruises.filter((cruise) => selectedDurations.includes(cruise.duration));
  }

  if (selectedFeatures.length > 0) {
    filteredCruises = filteredCruises.filter((cruise) =>
      selectedFeatures.every((feature) => cruise.features.includes(feature))
    );
  }
  const handleDeparturePointFilter = (point) => {
    setSelectedDeparturePoint(point);
  };
  const uniqueDeparturePoints = [...new Set(cruiseData.map((cruise) => cruise.departurePoint))];
  // Add after other filters
  if (selectedDeparturePoint) {
    filteredCruises = filteredCruises.filter((cruise) => cruise.departurePoint === selectedDeparturePoint);
  }
  const handlePriceRangeFilter = (range) => {
    setSelectedPriceRange(range);
  };
  // Add after other filters
  if (selectedPriceRange) {
    const selectedRange = priceRanges.find((range) => range.value === selectedPriceRange);
    if (selectedRange) {
      filteredCruises = filteredCruises.filter(
        (cruise) => cruise.price >= selectedRange.min && cruise.price <= selectedRange.max
      );
    }
  }
  const handleSortOptionChange = (option) => {
    setSortOption(option);
  };
  // Add after filters
  if (sortOption) {
    filteredCruises = [...filteredCruises].sort((a, b) => {
      if (sortOption === "low-to-high") {
        return a.price - b.price;
      }
      if (sortOption === "high-to-low") {
        return b.price - a.price;
      }
      return 0;
    });
  }
  // Calculate total pages after filtering
  const totalPages = Math.ceil(filteredCruises.length / itemsPerPage);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCruises = filteredCruises.slice(indexOfFirstItem, indexOfLastItem);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const startItem = filteredCruises.length === 0 ? 0 : indexOfFirstItem + 1;
  const endItem = Math.min(indexOfLastItem, filteredCruises.length);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: "32px",
          border: "1px solid #eaecf0",
          bgcolor: "#fff",
          boxShadow: "0px 1px 2px 0px rgba(16,24,40,.06), 0px 1px 3px 0px rgba(16,24,40,.1)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          sx={{ my: 3, fontFamily: "Archivo, sans-serif" }}
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

        {/* Search bar and filters */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Nhập tên du thuyền"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2}>
              <TextField
                select
                value={selectedDeparturePoint}
                onChange={(e) => handleDeparturePointFilter(e.target.value)}
                SelectProps={{
                  displayEmpty: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PinDrop color="action" />
                    </InputAdornment>
                  ),
                }}
                size="small"
                sx={{ opacity: "0.8" }}
              >
                <MenuItem value=""> Tất cả địa điểm</MenuItem>
                {uniqueDeparturePoints.map((point) => (
                  <MenuItem key={point} value={point}>
                    {point}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                value={selectedPriceRange}
                onChange={(e) => handlePriceRangeFilter(e.target.value)}
                SelectProps={{
                  displayEmpty: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MonetizationOnOutlined color="action" />
                    </InputAdornment>
                  ),
                }}
                size="small"
                sx={{
                  minWidth: 180,
                  backgroundColor: "#fff",
                }}
              >
                <MenuItem value="">Tất cả mức giá</MenuItem>
                {priceRanges.map((range) => (
                  <MenuItem key={range.value} value={range.value}>
                    {range.label}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontFamily: "Archivo, sans-serif",
                  height: "48px",
                  borderRadius: "32px",
                  bgcolor: "#77dada",
                  color: "#333",
                  "&:hover": { bgcolor: "#0e4f4f", color: "#fff" },
                }}
              >
                Tìm kiếm
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Results count and sort */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          mt: 10,
          fontFamily: "Archivo, sans-serif",
        }}
        Cheryl
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            bgcolor: "#fff",
            borderRadius: "32px",
            p: "5px 20px",
          }}
        >
          <Typography variant="h4" color="black" fontWeight="bold">
            Tìm thấy {filteredCruises.length} kết quả
          </Typography>
          <BlueIndicator />
        </Box>
        <TextField
          select
          value={sortOption}
          onChange={(e) => handleSortOptionChange(e.target.value)}
          SelectProps={{
            displayEmpty: true,
          }}
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
            backgroundColor: "#fff",
            borderRadius: "32px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "32px",
              height: "50px",
              fontFamily: "Archivo, sans-serif",
              fontWeight: 500,
              border: "0px",
            },
          }}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Main content */}
      <Grid container spacing={3}>
        {/* Sidebar filters */}
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: "32px",
              border: "1px solid #eaecf0",
              boxShadow: "0px 1px 2px 0px rgba(16,24,40,.06), 0px 1px 3px 0px rgba(16,24,40,.1)",
            }}
          >
            <Typography variant="h6" fontFamily="Archivo, sans-serif" fontWeight="bold" sx={{ mb: 2 }}>
              Lọc kết quả
            </Typography>
            <Divider sx={{ my: 1 }} />

            {/* Star rating filter */}
            <Box sx={{ mb: 3 }}>
              <FilterSectionTitle fontFamily="Archivo, sans-serif" variant="subtitle1">
                Xếp hạng sao
              </FilterSectionTitle>
              <FormGroup>
                {[5, 4, 3].map((star) => (
                  <FormControlLabel
                    key={star}
                    control={
                      <Checkbox
                        checked={selectedStars.includes(star)}
                        onChange={() => handleStarFilter(star)}
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

            {/* Duration filter */}
            <Box sx={{ mb: 3 }}>
              <FilterSectionTitle fontFamily="Archivo, sans-serif" variant="subtitle1">
                Thời gian
              </FilterSectionTitle>
              <FormGroup>
                {["2 ngày 1 đêm", "3 ngày 2 đêm"].map((duration) => (
                  <FormControlLabel
                    key={duration}
                    control={
                      <Checkbox
                        checked={selectedDurations.includes(duration)}
                        onChange={() => handleDurationFilter(duration)}
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

            {/* Features filter */}
            <Box sx={{ mb: 3 }}>
              <FilterSectionTitle fontFamily="Archivo, sans-serif" variant="subtitle1">
                Tiện ích
              </FilterSectionTitle>
              <FormGroup>
                {availableFeatures.slice(0, featureShowCount).map((feature) => (
                  <FormControlLabel
                    key={feature}
                    control={
                      <Checkbox
                        checked={selectedFeatures.includes(feature)}
                        onChange={() => handleFeatureFilter(feature)}
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
                  onClick={() => setFeatureShowCount((prev) => prev + 5)}
                >
                  Xem thêm
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Cruise cards */}
        <Grid item xs={12} md={9}>
          <Stack spacing={3}>
            {currentCruises.map((cruise) => (
              <Card
                key={cruise.id}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", md: "row" },
                  borderRadius: "32px",
                  bgcolor: "#fff",
                  width: "100%",
                  alignItems: "center",

                  cursor: "pointer",
                  transition: "transform 0.2s",
                  border: "1px solid #eaecf0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                {/* Image */}
                <Box
                  sx={{
                    position: "relative",
                    width: { xs: "100%", md: "45%" },
                    padding: "16px",
                  }}
                >
                  <CardMedia
                    component="img"
                    height={200}
                    image={
                      cruise.image ||
                      `https://via.placeholder.com/300x200?text=${encodeURIComponent(cruise.title)}`
                    }
                    alt={cruise.title}
                    sx={{
                      width: "352px",
                      height: "264px",
                      borderRadius: "32px",
                      position: "relative",
                      overflow: "hidden",
                      objectFit: "cover",
                      maxWidth: "100%",
                      boxShadow:
                        "0 4px 6px -2px rgba(16, 24, 40, .06), 0 12px 16px -4px rgba(16, 24, 40, .1);",
                    }}
                  />
                  <HotSaleBadge
                    sx={{
                      display: "flex",
                      borderRadius: "16px",
                      fontFamily: "Archivo, sans-serif",
                      left: "28px",
                      top: "28px",
                      color: "#7a2e0e",
                      position: "absolute",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "2px 8px 2px 6px",
                      backgroundColor: "#fedf89",
                      gap: "4px",
                    }}
                  >
                    <StarOutline sx={{ fontSize: "16px", color: "#f79009" }} />
                    4.9 (12) đánh giá
                  </HotSaleBadge>
                </Box>

                {/* Content */}
                <Box
                  sx={{
                    display: "flex",
                    position: "relative",
                    flexDirection: "column",
                    width: { xs: "100%", md: "55%" },
                    justifyContent: "space-between",
                    padding: "0 16px",
                    gap: "20px",
                  }}
                >
                  {/* Upper section */}
                  <Box sx={{ gap: "10px" }}>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      gutterBottom
                      fontFamily={"Archivo, sans-serif"}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "16px",
                        width: "fit-content",
                        padding: "5px 8px",

                        boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)",
                      }}
                    >
                      {cruise.departurePoint && `Du thuyền ${cruise.departurePoint}`}
                    </Typography>
                    <Typography
                      fontFamily={"Archivo, sans-serif"}
                      sx={{
                        fontSize: "23px",
                        color: "#333",
                        fontWeight: "700",
                        lineHeight: "32px",
                      }}
                    >
                      {cruise.title}
                    </Typography>
                    <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CalendarTodayIcon
                          sx={{
                            fontSize: "1rem",
                            mr: 0.5,
                            color: "text.secondary",
                          }}
                        />
                        <Typography fontFamily={"Archivo, sans-serif"} variant="body2" color="text.secondary">
                          {cruise.duration}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <LocationOnIcon
                          sx={{
                            fontSize: "1rem",
                            mr: 0.5,
                            color: "text.secondary",
                          }}
                        />
                        <Typography fontFamily={"Archivo, sans-serif"} variant="body2" color="text.secondary">
                          {cruise.departurePoint}
                        </Typography>
                      </Box>
                    </Stack>
                    {/* Features */}
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      sx={{
                        fontWeight: 600,
                        opacity: 0.8,
                        fontFamily: "Archivo, sans-serif",
                        lineHeight: "24px",
                        gap: "5px 0",
                      }}
                    >
                      {cruise.features.slice(0, 5).map((feature, index) => (
                        <FeatureChip key={index} label={feature} size="small" />
                      ))}
                      {cruise.features.length > 5 && (
                        <FeatureChip label={`+${cruise.features.length - 5}`} size="small" />
                      )}
                    </Stack>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  {/* Bottom section */}
                  <Box sx={{ justifyContent: "flex-end" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "18px",
                          lineHeight: "28px",
                          fontWeight: 700,
                          color: "#0E4F4F",
                        }}
                        fontFamily={"Archivo, sans-serif"}
                      >
                        {cruise.priceDisplay}
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{
                          textTransform: "none",
                          fontFamily: "Archivo, sans-serif",
                          height: "35px",
                          borderRadius: "32px",
                          bgcolor: "#77dada",
                          color: "#333",
                          "&:hover": { bgcolor: "#0e4f4f", color: "#fff" },
                        }}
                      >
                        Đặt ngay
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>

          {/* Pagination */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
            }}
          >
            <Typography
              fontFamily="Archivo, sans-serif"
              variant="body2"
              color="text.secondary"
              sx={{
                mr: 1,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                backgroundColor: "#fff",
                padding: "5px 10px",
                borderRadius: "32px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              Đang xem :{" "}
              <p
                style={{
                  padding: "5px 10px ",
                  border: "2px solid gray",
                  borderRadius: "100%",
                  margin: "0 5px",
                }}
              >
                {" "}
                {endItem}
              </p>{" "}
              trong tổng số {filteredCruises.length}
            </Typography>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handleChangePage}
              color="info"
              showFirstButton
              showLastButton
              sx={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: 600,
                backgroundColor: "#eaecf0",
                padding: "5px 10px",
                borderRadius: "32px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CardBoat;
