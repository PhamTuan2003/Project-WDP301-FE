import React from "react";
import { Paper, Typography, Box, Button, Stack, TextField, MenuItem, useTheme } from "@mui/material";

const searchOptions = {
  cruise: ["Tất cả du thuyền", "Heritage", "Ambassador", "Grand Pioneers", "Capella"],
  location: ["Tất cả địa điểm", "Vịnh Hạ Long", "Vịnh Lan Hạ", "Cát Bà"],
  guest: ["Tất cả mọi giá", "< 3 triệu", "3-5 triệu", "> 5 triệu"],
};

export default function Banner() {
  const theme = useTheme();
  const backgroundImage = theme.palette.mode === 'light' ? '/images/background.jpg' : '/images/background2.jpg';

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 750,
        position: "relative",
        background: `url(${backgroundImage}) center/cover no-repeat`,
        py: 10,
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Search Box */}
      <Paper
        elevation={3}
        sx={{
          py: { xs: 5, md: 5 },
          px: { xs: 1, md: 4 },
          borderRadius: 4,
          minWidth: { xs: "95%", md: 600 },
          maxWidth: 720,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "absolute",
          bottom: { xs: -48, md: -85 },
          left: 0,
          right: 0,
          bgcolor: (theme) => theme.palette.background.paper,
          border: "1px solid",
          borderColor: (theme) => theme.palette.divider,
          boxShadow: (theme) => theme.shadows[3],
        }}
      >
        <Typography variant="h6" fontWeight={700} align="center" sx={{ color: "primary.main" }}>
          Bạn lựa chọn du thuyền Hạ Long nào?
        </Typography>
        <Typography variant="body2" align="center" mb={2} sx={{ color: "text.secondary" }}>
          Hơn 100 tour du thuyền hạng sang, chất lượng tốt sẵn sàng cho bạn chọn
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} width="100%">
          <TextField
            select
            size="small"
            fullWidth
            defaultValue={searchOptions.cruise[0]}
            label="Loại du thuyền"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px",
                bgcolor: (theme) => theme.palette.background.paper,
                "& fieldset": {
                  borderColor: (theme) => theme.palette.divider,
                },
              },
              "& .MuiInputLabel-root": { color: "text.secondary" },
              "& .MuiInputBase-input": { color: "text.primary" },
              "& .MuiSelect-icon": { color: "text.primary" },
            }}
          >
            {searchOptions.cruise.map((option) => (
              <MenuItem key={option} value={option} sx={{ color: "text.primary" }}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            fullWidth
            defaultValue={searchOptions.location[0]}
            label="Địa điểm"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px",
                bgcolor: (theme) => theme.palette.background.paper,
                "& fieldset": {
                  borderColor: (theme) => theme.palette.divider,
                },
              },
              "& .MuiInputLabel-root": { color: "text.secondary" },
              "& .MuiInputBase-input": { color: "text.primary" },
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
            size="small"
            fullWidth
            defaultValue={searchOptions.guest[0]}
            label="Mức giá"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px",
                bgcolor: (theme) => theme.palette.background.paper,
                "& fieldset": {
                  borderColor: (theme) => theme.palette.divider,
                },
              },
              "& .MuiInputLabel-root": { color: "text.secondary" },
              "& .MuiInputBase-input": { color: "text.primary" },
              "& .MuiSelect-icon": { color: "text.primary" },
            }}
          >
            {searchOptions.guest.map((option) => (
              <MenuItem key={option} value={option} sx={{ color: "text.primary" }}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            size="large"
            sx={{
              minWidth: { xs: "100%", sm: 120 },
              width: { xs: "100%", sm: "auto" },
              py: 1,
              bgcolor: "primary.main",
              color: (theme) => theme.palette.getContrastText(theme.palette.primary.main),
              borderRadius: "32px",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Tìm kiếm
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}