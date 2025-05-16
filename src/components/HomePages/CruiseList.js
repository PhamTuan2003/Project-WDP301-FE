import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, CardActions, Button, Grid, Chip, Stack } from '@mui/material';

const cruises = [
  { id: 1, name: "Heritage Bình Chuẩn Cát Bà", image: "https://ext.same-assets.com/834882384/3732064722.webp", review: 4.9, reviewCount: 12, bay: "Vịnh Hạ Long", year: 2019, rooms: 20, price: 4150000 },
  { id: 2, name: "Ambassador Hạ Long", image: "https://ext.same-assets.com/834882384/4098236333.webp", review: 5.0, reviewCount: 3, bay: "Vịnh Hạ Long", year: 2018, rooms: 46, price: 3850000 },
  { id: 3, name: "Grand Pioneers", image: "https://ext.same-assets.com/834882384/2309670433.webp", review: 5.0, reviewCount: 3, bay: "Vịnh Hạ Long", year: 2023, rooms: 56, price: 5150000 },
  { id: 4, name: "Capella", image: "https://ext.same-assets.com/834882384/1826411894.webp", review: 5.0, reviewCount: 2, bay: "Vịnh Hạ Long", year: 2020, rooms: 30, price: 4450000 },
  { id: 5, name: "Scarlet Pearl", image: "https://ext.same-assets.com/834882384/736697718.webp", review: 5.0, reviewCount: 3, bay: "Vịnh Hạ Long", year: 2019, rooms: 22, price: 3750000 },
  { id: 6, name: "Lyra Grandeur", image: "https://ext.same-assets.com/834882384/2885976414.bin", review: 0, reviewCount: 0, bay: "Vịnh Hạ Long", year: 2025, rooms: 33, price: 5050000 },
];

export default function CruiseList() {
  return (
    <Box sx={{ maxWidth: 1240, mx: 'auto', px: 2, py: 15 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom color="text.primary">
        Du thuyền mới và phổ biến nhất
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Tận hưởng sự xa hoa và đẳng cấp tối đa trên du thuyền mới nhất và phổ biến nhất. Khám phá một hành
        trình tuyệt vời đưa bạn vào thế giới của sự sang trọng, tiện nghi và trải nghiệm không thể quên.
      </Typography>
      <Grid container spacing={3}>
        {cruises.map((cruise) => (
          <Grid item xs={12} sm={6} md={4} key={cruise.id}>
            <Card
              sx={{
                borderRadius: 4,
                height: '100%',
                boxShadow: (theme) => theme.shadows[1],
                backgroundColor: (theme) => theme.palette.background.paper,
              }}
            >
              <CardMedia
                component="img"
                height="160"
                image={cruise.image}
                alt={cruise.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <Chip label={cruise.bay} color="primary" size="small" />
                  <Typography variant="caption" color="text.secondary">
                    {cruise.year} - {cruise.rooms} phòng
                  </Typography>
                </Stack>
                <Typography gutterBottom variant="subtitle1" fontWeight={600} sx={{ minHeight: 36 }}>
                  {cruise.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Đánh giá: {cruise.review > 0 ? `${cruise.review} (${cruise.reviewCount})` : 'Chưa có'}
                </Typography>
                <Typography variant="h6" color="primary" mt={1}>
                  {cruise.price.toLocaleString()}đ / khách
                </Typography>
              </CardContent>
              <CardActions sx={{ pt: 0, justifyContent: 'center' }}>
                <Button variant="contained" color="primary" sx={{ width: '50%' }}>
                  Đặt ngay
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mt={4} textAlign="center">
        <Button variant="outlined" color="primary" sx={{ borderRadius: 3, px: 5 }}>
          Xem tất cả du thuyền →
        </Button>
      </Box>
    </Box>
  );
}