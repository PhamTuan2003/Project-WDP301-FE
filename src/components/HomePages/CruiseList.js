import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Card, CardContent, CardMedia, CardActions, Button, Grid, Chip, Stack } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn"; // Icon Location
import PersonIcon from "@mui/icons-material/Person"; // Icon người
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat"; // Icon tàu thủy

export default function CruiseList() {
  const [cruises, setCruises] = useState([]);

  useEffect(() => {
    const fetchCruises = async () => {
      try {
        const response = await axios.get("http://localhost:9999/api/v1/yachts", {
          params: {
            limit: 6,
            populate: "locationId,yachtTypeId",
          },
        });

        // Kiểm tra và lấy mảng từ response.data
        const yachts = Array.isArray(response.data) ? response.data : response.data.data || [];

        // Lấy giá rẻ nhất từ RoomType cho từng du thuyền
        const cruisesWithPrice = await Promise.all(
          yachts.map(async (yacht) => {
            try {
              const roomTypeResponse = await axios.get(`http://localhost:9999/api/v1/room-types/yacht/${yacht._id}`);
              const roomTypes = roomTypeResponse.data;

              // Tìm giá rẻ nhất
              const cheapestPrice = roomTypes.length > 0 ? Math.min(...roomTypes.map((rt) => rt.price)) : null;

              return {
                ...yacht,
                cheapestPrice,
              };
            } catch (err) {
              console.error(`Lỗi khi lấy giá cho du thuyền ${yacht.name}:`, err);
              return {
                ...yacht,
                cheapestPrice: null,
              };
            }
          })
        );
        setCruises(cruisesWithPrice);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách du thuyền:", err);
      }
    };

    fetchCruises();
  }, []);

  return (
    <Box sx={{ maxWidth: 1240, mx: "auto", px: 2, py: 15 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom color="text.primary">
        Du thuyền mới và phổ biến nhất
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Tận hưởng sự xa hoa và đẳng cấp tối đa trên du thuyền mới nhất và phổ biến nhất. Khám phá một hành trình tuyệt
        vời đưa bạn vào thế giới của sự sang trọng, tiện nghi và trải nghiệm không thể quên.
      </Typography>
      <Grid container spacing={3}>
        {cruises.map((cruise) => (
          <Grid item xs={12} sm={6} md={4} key={cruise._id}>
            <Card
              sx={{
                borderRadius: 4,
                height: "100%",
                boxShadow: (theme) => theme.shadows[1],
                backgroundColor: (theme) => theme.palette.background.paper,
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={cruise.image || "/images/default-yacht.jpg"}
                alt={cruise.name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent>
                {/* Dòng 1: Location */}
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <LocationOnIcon color="primary" fontSize="small" />
                  <Typography variant="caption" color="text.secondary">
                    <Chip label={cruise.locationId?.name || "Không xác định"} color="primary" size="small" />
                  </Typography>
                </Stack>

                {/* Dòng 2: Tên du thuyền */}
                <Typography gutterBottom variant="subtitle1" fontWeight={600} sx={{ minHeight: 36, mb: 1 }}>
                  {cruise.name}
                </Typography>

                {/* Dòng 3: Icon tàu, launch, hullBody, yachtType */}
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <DirectionsBoatIcon color="action" fontSize="small" />
                  <Typography variant="caption" color="text.secondary">
                    Hạ thuỷ {cruise.launch} - Thân vỏ {cruise.hullBody} - {cruise.yachtTypeId?.name || "Không xác định"}
                  </Typography>
                </Stack>

                {/* Dòng 4: Giá và sức chứa với icon người */}
                <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                  <Typography variant="h6" color="primary">
                    {cruise.cheapestPrice ? `${cruise.cheapestPrice.toLocaleString()}đ / khách` : "chưa có giá"}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography variant="body2" color="text.secondary">
                      Sức chứa: {cruise.rule}
                    </Typography>
                    <PersonIcon color="action" fontSize="small" />
                  </Stack>
                </Stack>

              </CardContent>
              <CardActions sx={{ pt: 0, justifyContent: "center" }}>
                <Button variant="contained" color="primary" sx={{ width: "50%" }}>
                  Đặt ngay
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mt={4} textAlign="center">
        <Button variant="outlined" color="primary" component={Link} to="/find-boat" sx={{ borderRadius: 3, px: 5 }}>
          Xem tất cả du thuyền →
        </Button>
      </Box>
    </Box>
  );
}
