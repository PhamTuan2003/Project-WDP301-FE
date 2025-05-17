import React from "react";
import { Box, Typography, Card, CardContent, CardMedia, Grid, Button, CardActions } from "@mui/material";

const destinations = [
  {
    name: "Vịnh Hạ Long",
    image: "https://ext.same-assets.com/834882384/741241613.jpeg",
    link: "#",
  },
  {
    name: "Vịnh Lan Hạ",
    image: "https://ext.same-assets.com/834882384/1976775946.jpeg",
    link: "#",
  },
  {
    name: "Đảo Cát Bà",
    image: "https://ext.same-assets.com/834882384/2063254602.jpeg",
    link: "#",
  },
];

export default function Destination() {
  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", px: 2, py: 8 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Các điểm đến của Mixivivu
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Khám phá điểm du lịch tuyệt vời của Du thuyền Hạ Long. Hành trình đến thiên đường thiên nhiên.
      </Typography>
      <Grid container spacing={4}>
        {destinations.map((item, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <Card sx={{ borderRadius: 4, boxShadow: 1, height: "100%" }}>
              <CardMedia
                component="img"
                image={item.image}
                alt={item.name}
                height="175"
                sx={{ objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} align="center">
                  {item.name}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", pt: 0 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  href={item.link}
                  sx={{ borderRadius: 2, mb: 2, mx: 1, width: "70%" }}
                >
                  Xem ngay
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
