import React from "react";
import { Box, Typography, Grid, Card, CardMedia } from "@mui/material";

const partners = [
  "https://ext.same-assets.com/834882384/1475916938.png",
  "https://ext.same-assets.com/834882384/1216348293.png",
  "https://ext.same-assets.com/834882384/1658336896.png",
  "https://ext.same-assets.com/834882384/2956912027.png",
  "https://ext.same-assets.com/834882384/2169757183.png",
  "https://ext.same-assets.com/834882384/2544806471.png",
  "https://ext.same-assets.com/834882384/70805729.png",
  "https://ext.same-assets.com/834882384/2410236709.png",
  "https://ext.same-assets.com/834882384/63560133.png",
  "https://ext.same-assets.com/834882384/2458306925.png",
  "https://ext.same-assets.com/834882384/642037967.png",
  "https://ext.same-assets.com/834882384/701393398.png",
  "https://ext.same-assets.com/834882384/3082147983.png",
  "https://ext.same-assets.com/834882384/115243526.png",
];

export default function Partners() {
  return (
    <Box sx={{ width: '100%', bgcolor: '#f8f9fa', py: 8 }}>
      <Box maxWidth={1100} mx="auto" px={2}>
        <Typography variant="h6" fontWeight={700} mb={4} align="center">
          Đối tác cùng các Hãng Du thuyền Lớn
        </Typography>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {partners.map((logo, idx) => (
            <Grid key={idx} item xs={4} sm={2} md={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Card elevation={0} sx={{ p: 1, bgcolor: 'transparent', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CardMedia
                  component="img"
                  image={logo}
                  alt={`logo-${idx}`}
                  sx={{ width: '100%', maxWidth: 100, filter: 'grayscale(100%)', objectFit: "contain" }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
