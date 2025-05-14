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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MapIcon from "@mui/icons-material/Map";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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

const cruiseData = [
  {
    id: 1,
    title: "Du thuyền Heritage Bình Chuẩn Cát Bà",
    price: 4150000,
    priceDisplay: "4,150,000đ / khách",
    image: "./images/heritage-binh-chuan.jpg",
    rating: 10,
    duration: "2 ngày 1 đêm",
    departurePoint: "Hạ Long",
    features: [
      "Chỗ lưu trú",
      "Lặn biển đi bộ",
      "Bữa ăn",
      "Chỗ lưu trú 1",
      "Lặn biển đi bộ 2",
      "Bữa ăn 3",
      "Chỗ lưu trú 4",
      "Lặn biển đi bộ 5",
      "Bữa ăn 6",
      "Chỗ lưu trú 7",
      "Lặn biển đi bộ 8",
      "Bữa ăn 9",
      "Chỗ lưu trú 10",
      "Lặn biển đi bộ 11",
      "Bữa ăn 12",
      "Chỗ lưu trú 13",
      "Lặn biển đi bộ 14",
    ],
  },
  {
    id: 2,
    title: "Du thuyền Indochine",
    price: 4125000,
    priceDisplay: "4,125,000đ / khách",
    image: "/images/indochine.jpg",
    rating: 7,
    duration: "2 ngày 1 đêm",
    departurePoint: "Hạ Long",
    features: ["Bữa ăn", "Chỗ lưu trú", "Lặn biển đi bộ"],
  },
  {
    id: 3,
    title: "Du thuyền Le Theatre",
    price: 2700000,
    priceDisplay: "2,700,000đ / khách",
    image: "/images/le-theatre.jpg",
    rating: 8,
    duration: "2 ngày 1 đêm",
    departurePoint: "Hạ Long",
    features: ["Bữa ăn", "Chỗ lưu trú", "Lặn biển đi bộ"],
  },
  {
    id: 4,
    title: "Du thuyền Orchid Trendy",
    price: 4150000,
    priceDisplay: "4,150,000đ / khách",
    image: "/images/orchid-trendy.webp",
    rating: 7,
    duration: "2 ngày 1 đêm",
    departurePoint: "Hạ Long",
    features: ["Bữa ăn", "Chỗ lưu trú", "Lặn biển đi bộ"],
  },
  {
    id: 5,
    title: "Du thuyền Milalux",
    price: 2300000,
    priceDisplay: "2,300,000đ / khách",
    image: "/images/milalux.webp",
    rating: 8,
    duration: "2 ngày 1 đêm",
    departurePoint: "Hạ Long",
    features: ["Bữa ăn", "Chỗ lưu trú", "Lặn biển đi bộ"],
  },
];

// Derive unique features from cruiseData
const availableFeatures = [
  ...new Set(cruiseData.flatMap((cruise) => cruise.features)),
];

const CardBoat = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [featureShowCount, setFeatureShowCount] = useState(5); // Initial number of features to show

  const itemsPerPage = 5;

  // Filter handlers
  const handleStarFilter = (star) => {
    setSelectedStars((prev) =>
      prev.includes(star)
        ? prev.filter((item) => item !== star)
        : [...prev, star]
    );
  };

  const handleDurationFilter = (duration) => {
    setSelectedDurations((prev) =>
      prev.includes(duration)
        ? prev.filter((item) => item !== duration)
        : [...prev, duration]
    );
  };

  const handleFeatureFilter = (feature) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((item) => item !== feature)
        : [...prev, feature]
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
      selectedStars.includes(
        cruise.rating >= 9 ? 5 : cruise.rating >= 7 ? 4 : 3
      )
    );
  }

  if (selectedDurations.length > 0) {
    filteredCruises = filteredCruises.filter((cruise) =>
      selectedDurations.includes(cruise.duration)
    );
  }

  if (selectedFeatures.length > 0) {
    filteredCruises = filteredCruises.filter((cruise) =>
      selectedFeatures.every((feature) => cruise.features.includes(feature))
    );
  }

  // Calculate total pages after filtering
  const totalPages = Math.ceil(filteredCruises.length / itemsPerPage);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCruises = filteredCruises.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

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
          boxShadow:
            "0px 1px 2px 0px rgba(16,24,40,.06), 0px 1px 3px 0px rgba(16,24,40,.1)",
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
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<MapIcon />}
                sx={{
                  borderColor: "grey.300",
                  color: "text.secondary",
                  textTransform: "none",
                  "&:hover": { borderColor: "grey.400" },
                }}
              >
                Tất cả địa điểm
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<AttachMoneyIcon />}
                sx={{
                  borderColor: "grey.300",
                  color: "text.secondary",
                  textTransform: "none",
                  "&:hover": { borderColor: "grey.400" },
                }}
              >
                Tất cả mức giá
              </Button>
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontFamily: "Archivo, sans-serif",
                  height: "50px",
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
        <Button
          endIcon={<KeyboardArrowDownIcon />}
          sx={{
            textTransform: "none",
            color: "#333",
            fontFamily: "Archivo, sans-serif",
            height: "50px",
            borderRadius: "32px",
            bgcolor: "#fff",
            border: "1px solid #eaecf0",
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          Không sắp xếp
        </Button>
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
              boxShadow:
                "0px 1px 2px 0px rgba(16,24,40,.06), 0px 1px 3px 0px rgba(16,24,40,.1)",
            }}
          >
            <Typography
              variant="h6"
              fontFamily="Archivo, sans-serif"
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              Lọc kết quả
            </Typography>
            <Divider sx={{ my: 1 }} />

            {/* Star rating filter */}
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
              <FilterSectionTitle
                fontFamily="Archivo, sans-serif"
                variant="subtitle1"
              >
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
                  flexDirection: { xs: "column", md: "row" },
                  borderRadius: 2,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                {/* Image */}
                <Box
                  sx={{
                    position: "relative",
                    width: { xs: "100%", md: "40%" },
                  }}
                >
                  <CardMedia
                    component="img"
                    height={200}
                    image={
                      cruise.image ||
                      `https://via.placeholder.com/300x200?text=${encodeURIComponent(
                        cruise.title
                      )}`
                    }
                    alt={cruise.title}
                    sx={{ height: "100%", objectFit: "cover" }}
                  />
                  <HotSaleBadge>HOT SALE giá sốc</HotSaleBadge>
                </Box>

                {/* Content */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: { xs: "100%", md: "60%" },
                    justifyContent: "space-between",
                    p: 2,
                  }}
                >
                  {/* Upper section */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      gutterBottom
                    >
                      {cruise.departurePoint &&
                        `Du thuyền ${cruise.departurePoint}`}
                    </Typography>
                    <Typography
                      variant="h6"
                      component="h3"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {cruise.title}
                    </Typography>

                    {/* Cruise details */}
                    <Stack
                      direction="row"
                      spacing={3}
                      alignItems="center"
                      sx={{ mb: 1.5 }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CalendarTodayIcon
                          sx={{
                            fontSize: "1rem",
                            mr: 0.5,
                            color: "text.secondary",
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
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
                        <Typography variant="body2" color="text.secondary">
                          {cruise.departurePoint}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Features */}
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      sx={{ mb: 2 }}
                    >
                      {cruise.features.map((feature, index) => (
                        <FeatureChip key={index} label={feature} size="small" />
                      ))}
                    </Stack>
                  </Box>

                  {/* Bottom section */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      mt: { xs: 2, md: 0 },
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Khởi hành
                      </Typography>
                      <Typography variant="body2">+{cruise.rating}</Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="h6" color="error" fontWeight="bold">
                        {cruise.priceDisplay}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ mt: 1, textTransform: "none" }}
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
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                Đang xem
              </Typography>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handleChangePage}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CardBoat;
