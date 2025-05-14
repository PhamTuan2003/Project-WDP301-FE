import React from "react";
import { Paper, Typography, Box, Button, Stack, TextField, MenuItem, useTheme } from "@mui/material";

const searchOptions = {
  cruise: ["Tất cả du thuyền", "Heritage", "Ambassador", "Grand Pioneers", "Capella"],
  location: ["Tất cả địa điểm", "Vịnh Hạ Long", "Vịnh Lan Hạ", "Cát Bà"],
  guest: ["Tất cả mọi giá", "< 3 triệu", "3-5 triệu", "> 5 triệu"],
};

export default function Banner() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 750,
        position: "relative",
        background: `url('/images/background.jpg') center/cover no-repeat`,
        borderRadius: { xs: 0, md: 4 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 4,
      }}
    >
      {/* Search Box */}
      <Paper
        elevation={3}
        sx={{
          py: { xs: 5, md: 3 },
          px: { xs: 1, md: 4 },
          borderRadius: 4,
          minWidth: { xs: "95%", md: 600 },
          maxWidth: 720,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "absolute",
          bottom: { xs: -48, md: -52 },
          left: 0,
          right: 0,
        }}
      >
        <Typography variant="h6" fontWeight={700} align="center" color="primary">
          Bạn lựa chọn du thuyền Hạ Long nào?
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" mb={2}>
          Hơn 100 tour du thuyền hạng sang, chất lượng tốt sẵn sàng cho bạn chọn
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} width="100%">
          <TextField
            select
            size="small"
            fullWidth
            defaultValue={searchOptions.cruise[0]}
            label="Loại du thuyền"
          >
            {searchOptions.cruise.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField select size="small" fullWidth defaultValue={searchOptions.location[0]} label="Địa điểm">
            {searchOptions.location.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField select size="small" fullWidth defaultValue={searchOptions.guest[0]} label="Mức giá">
            {searchOptions.guest.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              minWidth: { xs: "100%", sm: 120 }, // mobile full width, desktop min 120
              width: { xs: "100%", sm: "auto" }, // fix luôn width để không vượt
              py: 1
            }}
          >
            Tìm kiếm
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
