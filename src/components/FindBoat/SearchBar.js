import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  TextField,
  InputAdornment,
  Stack,
  Button,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PinDrop from "@mui/icons-material/PinDrop";
import MonetizationOnOutlined from "@mui/icons-material/MonetizationOnOutlined";
import {
  setSearchTerm,
  setDeparturePoint,
  setPriceRange,
  setSortOption,
} from "../../redux/action";
import { cruiseData, priceRanges } from "../../data/cruiseData";

const SearchBar = () => {
  const dispatch = useDispatch();
  const { searchTerm, selectedDeparturePoint, selectedPriceRange } =
    useSelector((state) => state.filters || {});

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");
  const [localDeparturePoint, setLocalDeparturePoint] = useState(
    selectedDeparturePoint || ""
  );
  const [localPriceRange, setLocalPriceRange] = useState(
    selectedPriceRange || ""
  );

  const uniqueDeparturePoints = [
    ...new Set(
      cruiseData.map((cruise) => cruise.departurePoint).filter(Boolean)
    ),
  ];

  const handleSearch = () => {
    dispatch(setSearchTerm(localSearchTerm));
    dispatch(setDeparturePoint(localDeparturePoint));
    dispatch(setPriceRange(localPriceRange));
    dispatch(setSortOption("")); // Reset sort option to empty
  };

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={12} md={6}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Nhập tên du thuyền"
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
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
            value={localDeparturePoint}
            onChange={(e) => setLocalDeparturePoint(e.target.value)}
            SelectProps={{ displayEmpty: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PinDrop color="action" />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{ opacity: 0.8 }}
          >
            <MenuItem value="">Tất cả địa điểm</MenuItem>
            {uniqueDeparturePoints.map((point) => (
              <MenuItem key={point} value={point}>
                {point}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            value={localPriceRange}
            onChange={(e) => setLocalPriceRange(e.target.value)}
            SelectProps={{ displayEmpty: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MonetizationOnOutlined color="action" />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{ minWidth: 180, backgroundColor: "#fff" }}
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
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default SearchBar;
