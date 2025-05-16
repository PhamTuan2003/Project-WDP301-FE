import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, TextField, InputAdornment, Stack, Button, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PinDrop from "@mui/icons-material/PinDrop";
import MonetizationOnOutlined from "@mui/icons-material/MonetizationOnOutlined";
import { setSearchTerm, setDeparturePoint, setPriceRange, setSortOption } from "../../redux/action";
import { cruiseData, priceRanges } from "../../data/cruiseData";

const SearchBar = () => {
  const dispatch = useDispatch();
  const { searchTerm, selectedDeparturePoint, selectedPriceRange } = useSelector(
    (state) => state.filters || {}
  );

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");
  const [localDeparturePoint, setLocalDeparturePoint] = useState(selectedDeparturePoint || "");
  const [localPriceRange, setLocalPriceRange] = useState(selectedPriceRange || "");

  const uniqueDeparturePoints = [
    ...new Set(cruiseData.map((cruise) => cruise.departurePoint).filter(Boolean)),
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
          sx={{
            borderColor: (theme) => theme.palette.divider,
            "& .MuiOutlinedInput-root": {
              borderRadius: "32px",
              color: 'text.primary',
            },
          }}
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
            sx={{
              borderColor: (theme) => theme.palette.divider,
              opacity: 0.8,
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px",
                color: 'text.primary',
              },
              "& .MuiSelect-icon": { color: 'text.primary' },
            }}
          >
            <MenuItem value="" sx={{ color: 'text.primary' }}>Tất cả địa điểm</MenuItem>
            {uniqueDeparturePoints.map((point) => (
              <MenuItem key={point} value={point} sx={{ color: 'text.primary' }}>
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
            sx={{
              minWidth: 180,
              borderColor: (theme) => theme.palette.divider,
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px",
                color: 'text.primary',
              },
              "& .MuiSelect-icon": { color: 'text.primary' },
            }}
          >
            <MenuItem value="" sx={{ color: 'text.primary' }}>Tất cả mức giá</MenuItem>
            {priceRanges.map((range) => (
              <MenuItem key={range.value} value={range.value} sx={{ color: 'text.primary' }}>
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
    </Grid>
  );
};

export default SearchBar;