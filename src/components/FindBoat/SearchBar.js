import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, TextField, InputAdornment, Stack, Button, MenuItem, Typography, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PinDrop from "@mui/icons-material/PinDrop";
import MonetizationOnOutlined from "@mui/icons-material/MonetizationOnOutlined";
import axios from "axios";
import { setSearchTerm, setDeparturePoint, setPriceRange, setFilteredYachts } from "../../redux/action";

const SearchBar = () => {
  const dispatch = useDispatch();
  const { searchTerm, selectedDeparturePoint, selectedPriceRange } = useSelector((state) => state.filters || {});
  const [searchOptions, setSearchOptions] = useState({
    cruise: ["Tất cả du thuyền"],
    location: ["Tất cả địa điểm"],
    price: ["Tất cả mức giá"],
  });
  const [locationMap, setLocationMap] = useState({});
  const [yachts, setYachts] = useState([]); // Danh sách du thuyền từ API
  const [filteredYachts, setFilteredYachtsLocal] = useState([]); // Kết quả lọc realtime

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const yachtsResponse = await axios.get("http://localhost:9999/api/v1/yachts", {
          params: { limit: 10, populate: "locationId" },
        });
        const yachtsData = Array.isArray(yachtsResponse.data?.data) ? yachtsResponse.data.data : yachtsResponse.data || [];
        setYachts(yachtsData);

        // Danh sách du thuyền
        const cruiseOptions = ["Tất cả du thuyền", ...new Set(yachtsData.map((y) => y.name))];

        // Danh sách địa điểm và ánh xạ name -> _id
        const locations = Array.from(new Set(yachtsData.map((y) => y.locationId?.name).filter((n) => n)));
        const locationOptions = ["Tất cả địa điểm", ...locations];
        const locationIdMap = {};
        yachtsData.forEach((y) => {
          if (y.locationId?.name) {
            locationIdMap[y.locationId.name] = y.locationId._id;
          }
        });

        // Danh sách giá
        const priceOptions = ["Tất cả mức giá", "< 3 triệu", "3-5 triệu", "> 5 triệu"];

        setSearchOptions({ cruise: cruiseOptions, location: locationOptions, price: priceOptions });
        setLocationMap(locationIdMap);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu tìm kiếm:", err);
      }
    };

    fetchOptions();
  }, []);

  // Lọc realtime khi thay đổi searchTerm, selectedDeparturePoint, selectedPriceRange
  useEffect(() => {
    const filtered = yachts.filter((yacht) => {
      const matchesSearchTerm =
        searchTerm === "Tất cả du thuyền" || yacht.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDeparturePoint =
        selectedDeparturePoint === "Tất cả địa điểm" || yacht.locationId?.name === selectedDeparturePoint;
      const matchesPriceRange = (() => {
        if (selectedPriceRange === "Tất cả mức giá") return true;
        const price = yacht.cheapestPrice || 0;
        if (selectedPriceRange === "< 3 triệu") return price < 3000000;
        if (selectedPriceRange === "3-5 triệu") return price >= 3000000 && price <= 5000000;
        if (selectedPriceRange === "> 5 triệu") return price > 5000000;
        return true;
      })();

      return matchesSearchTerm && matchesDeparturePoint && matchesPriceRange;
    });
    setFilteredYachtsLocal(filtered);
    dispatch(setFilteredYachts(filtered)); // Đồng bộ với Redux
  }, [searchTerm, selectedDeparturePoint, selectedPriceRange, yachts, dispatch]);

  const handleSearch = () => {
    // Trigger để đồng bộ hoặc làm gì đó bổ sung (nếu cần)
    dispatch(setSearchTerm(searchTerm));
    dispatch(setDeparturePoint(selectedDeparturePoint));
    dispatch(setPriceRange(selectedPriceRange));
    // Kết quả đã được cập nhật realtime trong useEffect
  };

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={12} md={6}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Nhập tên du thuyền"
          value={searchTerm || "Tất cả du thuyền"}
          onChange={(e) => dispatch(setSearchTerm(e.target.value || "Tất cả du thuyền"))}
          select
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          size="small"
          sx={{
            borderColor: (theme) => theme.palette.divider,
            "& .MuiOutlinedInput-root": {
              borderRadius: "32px",
              color: "text.primary",
            },
          }}
        >
          {searchOptions.cruise.map((option) => (
            <MenuItem key={option} value={option} sx={{ color: "text.primary" }}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} md={6}>
        <Stack direction="row" spacing={2}>
          <TextField
            select
            value={selectedDeparturePoint || "Tất cả địa điểm"}
            onChange={(e) => dispatch(setDeparturePoint(e.target.value || "Tất cả địa điểm"))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PinDrop color="action" />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{
              borderColor: (theme) => theme.palette.divider,
              opacity: 0.8,
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px",
                color: "text.primary",
              },
              "& .MuiSelect-icon": { color: "text.primary" },
            }}
          >
            {searchOptions.location.map((option) => (
              <MenuItem key={option} value={option} sx={{ color: "text.primary" }}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            value={selectedPriceRange || "Tất cả mức giá"}
            onChange={(e) => dispatch(setPriceRange(e.target.value || "Tất cả mức giá"))}
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
              borderColor: (theme) => theme.palette.divider,
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px",
                color: "text.primary",
              },
              "& .MuiSelect-icon": { color: "text.primary" },
            }}
          >
            {searchOptions.price.map((option) => (
              <MenuItem key={option} value={option} sx={{ color: "text.primary" }}>
                {option}
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
              bgcolor: "primary.main",
              color: (theme) => theme.palette.getContrastText(theme.palette.primary.main),
              "&:hover": { bgcolor: "primary.dark" },
            }}
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </Stack>
      </Grid>
      {/* Preview kết quả realtime */}
      <Grid item xs={12}>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Kết quả ({filteredYachts.length} du thuyền):
          </Typography>
          {filteredYachts.length > 0 ? (
            filteredYachts.map((yacht) => (
              <Typography key={yacht._id} variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                {yacht.name} - {yacht.locationId?.name || "Không rõ địa điểm"} - {yacht.cheapestPrice || "N/A"} VNĐ
              </Typography>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              Không tìm thấy du thuyền nào.
            </Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default SearchBar;