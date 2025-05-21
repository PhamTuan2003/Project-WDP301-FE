import React from "react";
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, CardActions } from "@mui/material";
import { Link } from "react-router-dom";

const news = [
  {
    title: "Du lịch Hạ Long - thời gian nào là đẹp nhất?",
    img: "https://storage.googleapis.com/a1aa/image/89346d98-2e05-4bec-8bd7-25e0035cf891.jpg",
    desc: "Hạ Long là một trong những điểm du lịch hot nhất miền Bắc được rất nhiều du khách yêu thích. Không...",
    date: "24/05/2025",
    link: "/blog",
  },
  {
    title: "Top 5 quán bún mọc ở Hà Nội nhất định bạn phải thử",
    img: "https://ext.same-assets.com/834882384/3897759098.bin",
    desc: "Không chỉ có bún chả, bún hải sản mà bún mọc Hà Nội cũng là một trong những món ăn làm nên sức hấp dẫn của ẩm thực Hà thành.",
    date: "13/05/2025",
    link: "/blog",
  },
  {
    title: "Bánh xíu páo Nam Định – Món bánh nhỏ mang hương vị lớn",
    img: "https://ext.same-assets.com/834882384/1972871760.bin",
    desc: "Ẩm thực Nam Định tự lâu đã nổi tiếng với những món ăn vừa mộc mạc, vừa tinh tế từ phở bò trứ danh đến xíu páo, nem nắm Giao Thủy...",
    date: "13/05/2025",
    link: "/blog",
  },
];

export default function NewsList() {
  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        px: 2,
        py: 8,
      }}
    >
      <Typography variant="h5" fontWeight={700} mb={2} color="text.primary">
        Hạ Long: Khám phá Sự đặc sắc và Cập nhật tin tức mới nhất
      </Typography>
      <Grid container spacing={4} mb={2}>
        {news.map((n, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <Card
              component={Link}
              to="/blog"
              sx={{
                borderRadius: 4,
                boxShadow: (theme) => theme.shadows[1],
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: (theme) => theme.palette.background.paper,
                textDecoration: "none", // ⬅️ DÒNG NÀY BỎ GẠCH CHÂN
                color: "inherit", // ⬅️ Giữ nguyên màu chữ mặc định
                "&:hover": {
                  textDecoration: "none", // ⬅️ Chống hover bị underline lại
                },
              }}
            >
              <CardMedia component="img" image={n.img} alt={n.title} height="145" sx={{ objectFit: "cover" }} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  gutterBottom
                  sx={{ minHeight: 50 }}
                  color="text.primary"
                >
                  {n.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minHeight: "4.5em",
                  }}
                >
                  {n.desc}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {n.date}
                </Typography>
              </CardContent>
              <CardActions sx={{ pt: 0, justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  href={n.link}
                  component={Link}
                  to="/blog"
                  sx={{ borderRadius: 2, mb: 2, mx: 2, width: "70%" }}
                >
                  Xem chi tiết
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
