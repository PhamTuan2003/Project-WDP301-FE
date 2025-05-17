import React, { useState, useEffect } from "react";
import { Box, Typography, Link, Grid, Stack } from "@mui/material";
import styled from "@emotion/styled";
import { Fab } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Fade from "@mui/material/Fade";

const BackToTopButton = styled(Fab)`
  position: fixed;
  bottom: 50px;
  right: 30px;
  z-index: 1000;
  color: white;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

export default function Footer() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const scrollDuration = 500;
    const scrollStep = -window.scrollY / (scrollDuration / 16);
    let scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 16);
  };

  return (
    <Box sx={{ bgcolor: "#232c36", color: "#f8f9fa", pt: 6, pb: 2 }}>
      <Box maxWidth={1100} mx="auto" px={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <Box
                component="img"
                src="https://ext.same-assets.com/834882384/3783633550.svg"
                alt="logo"
                sx={{ height: 40 }}
              />
              <Typography variant="h6" fontWeight={600} color="primary.main">
                Booking Yacht
              </Typography>
            </Stack>
            <Typography variant="body2" color="#99b5b8">
              Công ty TNHH Du Lịch và Dịch Vụ Booking Yacht
              <br />
              Toà nhà Delta-314, Km29 Đại học FPT, khu CNC Hoà Lạc, huyện Thạch Thất, TP. Hà Nội
              <br />
              Mã số doanh nghiệp: AAAAAAAAAAAA do Sở KHĐT TP Hà Nội cấp ngày 05/06/2023
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" mb={1} fontWeight={700}>
              Thông tin
            </Typography>
            <Stack spacing={0.5}>
              <Link href="#" color="inherit" underline="hover">
                Về chúng tôi
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Điều khoản & Điều kiện
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Chính sách riêng tư
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Hướng dẫn sử dụng
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Hình thức thanh toán
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Liên hệ
              </Link>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" mb={1} fontWeight={700}>
              Liên hệ
            </Typography>
            <Typography variant="body2" color="#a8babf">
              Hotline: 0123456789
            </Typography>
            <Typography variant="body2" color="#a8babf">
              Email: info@BookingYacht.com
            </Typography>
            <Box
              component="img"
              src="/images/logo-bo-cong-thuong.png"
              alt="Đã thông báo Bộ Công thương"
              sx={{ height: 48, mt: 2 }}
            />
          </Grid>
        </Grid>
        <Box textAlign="center" mt={6} sx={{ opacity: 0.7 }}>
          <Typography fontSize={12} color="#9eb2b6">
            &copy; Bản quyền 2025. Bảo lưu mọi quyền. Thiết kế bởi WDP301 - Group 4.
          </Typography>
        </Box>
      </Box>

      {/*Nút back-to-top quay lại đầu trang */}
      <Fade in={showButton}>
        <BackToTopButton color="success" onClick={scrollToTop}>
          <ArrowUpwardIcon />
        </BackToTopButton>
      </Fade>
    </Box>
  );
}