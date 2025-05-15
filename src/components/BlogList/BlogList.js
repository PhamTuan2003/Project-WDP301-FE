import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Pagination,
  IconButton,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';


const articles = [
  {
    title: 'Lịch trình chiêm bái xá lợi Phật tại chùa Quán Sứ',
    desc: 'Từ ngày 13 - 18.5, xá lợi Phật được cung nước về chùa Quán Sứ, đoàn cung rước sẽ đi qua các tuyến phố,...',
    date: '12/05/2025',
    img: 'https://storage.googleapis.com/a1aa/image/43dbbf4c-7f37-4fc8-6183-55643fe235a0.jpg',
  },
  {
    title: 'Top 5 quán bún mọc ở Hà Nội nhất định bạn phải thử',
    desc: 'Không chỉ có bún chả, bún hải sản... mà bún mọc Hà Nội cũng là một trong những món ăn làm nên sức hút...',
    date: '09/05/2025',
    img: 'https://storage.googleapis.com/a1aa/image/22bbc2c1-3f57-4c00-b174-5183cb7da3c6.jpg',
  },
  {
    title: 'Bánh Xíu Páo Nam Định – Món Bánh Nhỏ Mang Hương Vị Lớn',
    desc: 'Ẩm thực Nam Định từ lâu đã được biết đến với những món ăn vừa mộc mạc, vừa tinh tế – từ phở bò trứ danh...',
    date: '08/05/2025',
    img: 'https://storage.googleapis.com/a1aa/image/b3a1307c-3297-4dc8-c733-411818cf45f4.jpg',
  },
  {
    title: 'Du lịch Hạ Long - thời gian nào là đẹp nhất?',
    desc: 'Hạ Long là một trong những điểm du lịch hot nhất miền Bắc được rất nhiều du khách yêu thích. Không...',
    date: '24/04/2025',
    img: 'https://storage.googleapis.com/a1aa/image/89346d98-2e05-4bec-8bd7-25e0035cf891.jpg',
  },
  {
    title: 'Khám phá 5 bãi biển nổi bật tại Hội An cho mùa hè này',
    desc: 'Hội An không chỉ thu hút du khách bởi vẻ đẹp cổ kính của những con phố rêu phong mà còn quyến rũ lòng...',
    date: '22/04/2025',
    img: 'https://storage.googleapis.com/a1aa/image/5d022070-5037-46b2-9eeb-4b40e710d124.jpg',
  },
  {
    title: 'Top 5 Lăng Tẩm Đẹp Nhất Ở Huế – Những Di Sản Trường Tồn Cùng Thời...',
    desc: 'Huế – mảnh đất của những hoài niệm, nơi thời gian dường như chậm lại với tiếng chuông chùa, tiếng nư...',
    date: '18/04/2025',
    img: 'https://storage.googleapis.com/a1aa/image/24c33b8c-a232-4173-4fd2-4ba39ca9d97d.jpg',
  },
];

export default function HaLongNews() {
  return (
    <Container maxWidth="lg" className="halong-news" sx={{ pt: 10, pb: 20 }}>
      <Box maxWidth="600px">
        <Typography variant="h5" fontWeight={600}>
          Hạ Long: Khám phá Sự đặc sắc <br /> và Cập nhật tin tức mới nhất
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Hạ Long: Bí mật và Cuộc sống trong Vịnh - Khám phá và Cập nhật những tin tức hấp dẫn từ điểm đến tuyệt vời này.
        </Typography>

        <Box mt={2} display="flex" gap={1}>
          {[...Array(7)].map((_, i) => (
            <Box key={i} width="20px" height="1px" bgcolor="#9ED9D9" />
          ))}
        </Box>
      </Box>

      {/* Menu */}
      <Box
        display="flex"
        gap={1}
        bgcolor="#F9FAFB"
        borderRadius="8px"
        py={1}
        px={2}
        mt={5}
        maxWidth="400px"
        fontSize="11px"
      >
        <Button variant="outlined" size="small">
          Tất cả
        </Button>
        {['Du lịch', 'Khách sạn', 'Du thuyền'].map((item) => (
          <Button key={item} size="small" sx={{ color: 'gray' }}>
            {item}
          </Button>
        ))}
      </Box>

      {/* Articles */}
      <Grid container spacing={3} mt={3}>
        {articles.map((a, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card sx={{ borderRadius: '16px', border: '1px solid #E5E7EB', maxWidth: '350px', mx: 'auto' }}>
              <CardMedia
                component="img"
                height="180"
                image={a.img}
                alt={a.title}
                sx={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
              />
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} fontSize={14}>
                  {a.title}
                </Typography>
                <Typography variant="body2" fontSize={11} color="text.secondary" mt={1} className="line-clamp">
                  {a.desc}
                </Typography>
                <Typography variant="caption" color="text.disabled" display="block" mt={1}>
                  {a.date}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Divider sx={{ my: 6 }} />
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={1} fontSize={12}>
          <span>Đang xem:</span>
          <Box
            width={28}
            height={28}
            border="1px solid #D1D5DB"
            borderRadius="50%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight={600}
            color="#111827"
          >
            6
          </Box>
          <span>của 113</span>
        </Box>
        <Box mt={{ xs: 2, sm: 0 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton size="small">
              <ArrowBack fontSize="small" />
              <Typography ml={0.5}>Trước</Typography>
            </IconButton>
            <Pagination count={19} size="small" siblingCount={1} defaultPage={1} />
            <IconButton size="small">
              <Typography mr={0.5}>Tiếp</Typography>
              <ArrowForward fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
