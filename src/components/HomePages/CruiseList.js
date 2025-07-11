import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Grid,
  Chip,
  Stack,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";

export default function CruiseList() {
  const [cruises, setCruises] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCruises = async () => {
      try {
        const resBasic = await axios.get(
          "http://localhost:9999/api/v1/yachts",
          {
            params: { limit: 6 },
          }
        );
        const yachtsBasic = Array.isArray(resBasic.data.data)
          ? resBasic.data.data
          : [];

        const resWithPrice = await axios.get(
          "http://localhost:9999/api/v1/yachts/findboat"
        );
        const yachtsWithPrice = Array.isArray(resWithPrice.data.data)
          ? resWithPrice.data.data
          : [];

        const combinedYachts = await Promise.all(
          yachtsBasic.map(async (yacht) => {
            const match = yachtsWithPrice.find((y) => y._id === yacht._id);
            let imageUrl = "/images/placeholder.jpg";
            try {
              const imageRes = await axios.get(
                `http://localhost:9999/api/v1/yachtImages/yacht/${yacht._id}`
              );
              if (
                imageRes.data.success &&
                Array.isArray(imageRes.data.data) &&
                imageRes.data.data.length > 0
              ) {
                imageUrl = imageRes.data.data[0];
              }
            } catch (imageErr) {
              console.error(
                `Error fetching image for yacht ${yacht._id}:`,
                imageErr
              );
            }

            return {
              ...yacht,
              cheapestPrice: match?.cheapestPrice || null,
              image: imageUrl,
            };
          })
        );

        setCruises(combinedYachts);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách du thuyền:", err);
      }
    };

    fetchCruises();
  }, []);

  const handleClick = () => {
    navigate("/find-boat");
    window.scrollTo({ top: 0 });
    setTimeout(() => {
      window.location.reload();
    }, 20);
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return "chưa có giá";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ / khách";
  };

  return (
    <Box sx={{ maxWidth: 1240, mx: "auto", px: 2, py: 15 }}>
      <Typography
        variant="h4"
        fontWeight={800}
        mb={1}
        color="text.primary"
        fontFamily={"Archivo, sans-serif"}
        gutterBottom
      >
        Du thuyền mới và phổ biến nhất
      </Typography>
      <Typography
        color="text.primary"
        fontFamily={"Archivo, sans-serif"}
        mb={3}
      >
        Tận hưởng sự xa hoa và đẳng cấp tối đa trên du thuyền mới nhất và phổ
        biến nhất. Khám phá một hành trình tuyệt vời đưa bạn vào thế giới của sự
        sang trọng, tiện nghi và trải nghiệm không thể quên.
      </Typography>
      <Typography mb={6} fontFamily={"Archivo, sans-serif"} mt={-2}>
        <img src="/images/border.jpg" alt="border" width={100} />
      </Typography>
      <Grid container spacing={3}>
        {cruises.map((cruise) => (
          <Grid item xs={12} sm={6} md={4} key={cruise._id}>
            <Link
              to={`/boat-detail/${cruise._id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  borderRadius: 2,
                  pt: 2,
                  px: 2,
                  height: "100%",
                  boxShadow: (theme) => theme.shadows[1],
                  backgroundColor: (theme) => theme.palette.background.paper,
                  color: (theme) => theme.palette.text.primary,
                }}
              >
                <CardMedia
                  component="img"
                  image={cruise.image}
                  alt={cruise.name}
                  sx={{ objectFit: "cover", borderRadius: 2, maxHeight: 200 }}
                />
                <CardContent>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    borderRadius={1}
                    mb={2}
                    width="fit-content"
                  >
                    <LocationOnIcon color="primary" sx={{backgroundColor:"#f3f4f6", borderRadius:1}} fontSize="small" />
                    <Typography
                      variant="subtitle2"
                      fontFamily={"Archivo, sans-serif"}
                      color="text.primary"
                      sx={{ fontWeight: 500 }}
                    >
                      <Chip
                        label={cruise.locationId?.name || "Không xác định"}
                        size="small"
                      />
                    </Typography>
                  </Stack>

                  <Typography
                    gutterBottom
                    variant="h6"
                    fontWeight={600}
                    fontFamily={"Archivo, sans-serif"}
                    sx={{ minHeight: 36, mb: 1, color: "text.primary" }}
                  >
                    {cruise.name}
                  </Typography>

                  <Stack direction="row" alignItems="center" mb={2}>
                    <DirectionsBoatIcon color="action" mx={1} fontSize="small" />
                    <Typography
                      variant="caption"
                      fontFamily={"Archivo, sans-serif"}
                      color="text.primary"
                      sx={{ fontWeight: 500 }}
                    >
                      Hạ thuỷ {cruise.launch} - Thân vỏ {cruise.hullBody} -{" "}
                      {cruise.rule || "Không xác định"} phòng
                    </Typography>
                  </Stack>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography
                      variant="h6"
                      fontFamily={"Archivo, sans-serif"}
                      color="text.primary"
                      fontWeight={700}
                      justifyContent={"start"}
                    >
                      {formatPrice(cruise.price)}
                    </Typography>
                  </Stack>
                  <Button
                    variant="contained"
                    color="primary"
                    justifyContent={"end"}
                    sx={{
                      borderRadius: 2,
                     
                      width: "fit-content",
                      fontFamily: "Archivo, sans-serif",
                    }}
                  >
                    Đặt ngay
                  </Button>
                   </Box>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
      <Box mt={4} textAlign="center">
        <Button
          variant="outlined"
          color="primary"
          onClick={handleClick}
          sx={{
            borderRadius: 3,
            border: "1.4px solid",
            px: 4,
            py: 1,
            fontSize: 16,
            fontFamily: "Archivo, sans-serif",
          }}
        >
          Xem tất cả du thuyền →
        </Button>
      </Box>
    </Box>
  );
}
