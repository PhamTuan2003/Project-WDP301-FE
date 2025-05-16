import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { AiOutlineMoon, AiOutlineSun } from 'react-icons/ai';
import { Link } from "react-router-dom";

const menuLinks = [
  { label: "Tìm du thuyền", href: "/find-boat" },
  { label: "Khách sạn", href: "#" },
  { label: "Doanh nghiệp", href: "#" },
  { label: "Blog", href: "#" },
];

export default function Header({ toggleTheme, mode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 0, py: 1 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Box component="img" src="/images/logo.png" alt="LongWave Logo" sx={{ height: 80, mr: 2 }} />
          <Typography
            variant="h6"
            color="primary"
            fontWeight={700}
            fontFamily="'Pacifico', cursive"
            fontSize={32}
            component={Link}
            to="/"
            sx={{
              textDecoration: "none", // chính chủ, Material UI hiểu
              "&:hover": {
                textDecoration: "none", // ngăn nó underline khi hover luôn
              },
            }}
          >
            𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮
          </Typography>
        </Box>
        {/* Menu */}
        {!isMobile ? (
          <Stack direction="row" spacing={2} alignItems="center">
            {menuLinks.map((link) => (
              <Button
                href={link.href}
                key={link.label}
                color="inherit"
                md={{ fontWeight: 500, fontSize: 16, lineHeight: "24px" }}
              >
                {link.label}
              </Button>
            ))}
            <Typography fontSize={14} ml={1} color="text.secondary">
              <b>Hotline:&nbsp;</b>0123456789
            </Typography>
          </Stack>
        ) : (
          <IconButton size="large" edge="end" aria-label="menu">
            <MenuIcon />
          </IconButton>
        )}
        {/* Login/Register/Theme Toggle */}
        <Stack direction="row" spacing={1} ml={3}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            component={Link}
            to="/login"
            sx={{ borderRadius: 20, textTransform: "none" }}
            startIcon={<LoginIcon />}
          >
            Đăng nhập
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            component={Link}
            to="/register"
            sx={{ borderRadius: 20, textTransform: "none" }}
            startIcon={<PersonAddIcon />}
          >
            Đăng ký
          </Button>
          <IconButton onClick={toggleTheme} color="inherit" sx={{ p: 1 }}>
            {mode === "light" ? <AiOutlineMoon size={24} /> : <AiOutlineSun size={24} />}
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
