import React from "react";
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, CardActions } from "@mui/material";

const news = [
  {
    title: "Lịch trình chiêm bái xá lợi Phật tại chùa Quán Sứ",
    img: "https://ext.same-assets.com/834882384/3137552622.bin",
    desc: "Từ ngày 13 - 16.5, xá lợi Phật sẽ được cung rước về chùa Quán Sứ, đoàn cung rước sẽ đi qua các tuyến phố, khu vực trung tâm Q.Hoàn Kiếm như Lê Thánh Tông - Hàng Bài - hồ Hoàn Kiếm...",
    date: "13/05/2025",
    link: "#",
  },
  {
    title: "Top 5 quán bún mọc ở Hà Nội nhất định bạn phải thử",
    img: "https://ext.same-assets.com/834882384/3897759098.bin",
    desc: "Không chỉ có bún chả, bún hải sản mà bún mọc Hà Nội cũng là một trong những món ăn làm nên sức hấp dẫn của ẩm thực Hà thành.",
    date: "13/05/2025",
    link: "#",
  },
  {
    title: "Bánh xíu páo Nam Định – Món bánh nhỏ mang hương vị lớn",
    img: "https://ext.same-assets.com/834882384/1972871760.bin",
    desc: "Ẩm thực Nam Định tự lâu đã nổi tiếng với những món ăn vừa mộc mạc, vừa tinh tế từ phở bò trứ danh đến xíu páo, nem nắm Giao Thủy...",
    date: "13/05/2025",
    link: "#",
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
              sx={{
                borderRadius: 4,
                boxShadow: (theme) => theme.shadows[1],
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: (theme) => theme.palette.background.paper,
              }}
            >
              <CardMedia
                component="img"
                image={n.img}
                alt={n.title}
                height="145"
                sx={{ objectFit: "cover" }}
              />
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