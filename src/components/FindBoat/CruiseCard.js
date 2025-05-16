import React from "react";
import { Card, CardMedia, Box, Typography, Stack, Divider, Button, Chip, Badge } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarOutline from "@mui/icons-material/StarOutline";

// Custom HotSaleBadge (assuming it’s a styled Badge)
const HotSaleBadge = ({ children, ...props }) => <Badge {...props}>{children}</Badge>;

// Custom FeatureChip (assuming it’s a styled Chip)
const FeatureChip = (props) => (
  <Chip
    {...props}
    sx={{
      fontFamily: "Archivo, sans-serif",
      bgcolor: (theme) => theme.palette.mode === 'light' ? '#f0f7f7' : '#2f3b44',
      fontWeight: 600,
      opacity: 0.8,
      ...props.sx,
    }}
  />
);

const CruiseCard = ({ cruise }) => {
  // Defensive check for cruise prop
  if (!cruise || typeof cruise !== "object" || !cruise.id) {
    console.error("CruiseCard: Invalid or missing cruise prop", cruise);
    return null;
  }

  const {
    id,
    title = "Unknown Cruise",
    image,
    priceDisplay = "0đ",
    departurePoint = "Unknown",
    duration = "Unknown",
    features = [],
  } = cruise;

  return (
    <Card
      key={id}
      sx={{
        display: "flex",
        flexDirection: { xs: "row", md: "row" },
        borderRadius: "32px",
        bgcolor: (theme) => theme.palette.background.paper,
        width: "100%",
        alignItems: "center",
        cursor: "pointer",
        transition: "transform 0.2s",
        border: "1px solid",
        borderColor: (theme) => theme.palette.divider,
        boxShadow: (theme) => theme.shadows[1],
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
          image={image || `https://via.placeholder.com/300x200?text=${encodeURIComponent(title)}`}
          alt={title}
          sx={{
            width: "352px",
            height: "264px",
            borderRadius: "32px",
            position: "relative",
            overflow: "hidden",
            objectFit: "cover",
            maxWidth: "100%",
            boxShadow: (theme) => theme.shadows[1],
          }}
        />
        <HotSaleBadge
          sx={{
            display: "flex",
            borderRadius: "16px",
            fontFamily: "Archivo, sans-serif",
            left: "28px",
            top: "28px",
            color: (theme) => theme.palette.mode === 'light' ? '#7a2e0e' : '#fedf89',
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            padding: "2px 8px 2px 6px",
            backgroundColor: (theme) => theme.palette.mode === 'light' ? '#fedf89' : '#7a2e0e',
            gap: "4px",
          }}
        >
          <StarOutline sx={{ fontSize: "16px", color: (theme) => theme.palette.mode === 'light' ? '#f79009' : '#fedf89' }} />
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
            fontFamily="Archivo, sans-serif"
            sx={{
              display: "flex",
              alignItems: "center",
              borderRadius: "16px",
              width: "fit-content",
              padding: "5px 8px",
              marginBottom: "10px",
              boxShadow: (theme) => theme.shadows[1],
            }}
          >
            {departurePoint && `Du thuyền ${departurePoint}`}
          </Typography>
          <Typography
            fontFamily="Archivo, sans-serif"
            sx={{
              fontSize: "25px",
              color: 'text.primary',
              fontWeight: "700",
              lineHeight: "32px",
            }}
          >
            {title}
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
              <Typography fontFamily="Archivo, sans-serif" variant="body2" color="text.secondary">
                {duration}
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
              <Typography fontFamily="Archivo, sans-serif" variant="body2" color="text.secondary">
                {departurePoint}
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
            {features.slice(0, 5).map((feature, index) => (
              <FeatureChip key={index} label={feature} size="small" />
            ))}
            {features.length > 5 && <FeatureChip label={`+${features.length - 5}`} size="small" />}
          </Stack>
        </Box>
        <Divider sx={{ my: 1, borderColor: (theme) => theme.palette.divider }} />
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
                color: "primary.main",
              }}
              fontFamily="Archivo, sans-serif"
            >
              {priceDisplay}
            </Typography>
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                fontFamily: "Archivo, sans-serif",
                height: "35px",
                borderRadius: "32px",
                bgcolor: "primary.main",
                color: (theme) => theme.palette.getContrastText(theme.palette.primary.main),
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              Đặt ngay
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default CruiseCard;