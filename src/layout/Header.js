import React, { useEffect } from "react";
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

const menuLinks = [
  { label: "Tìm du thuyền", href: "/find-boat" },
  { label: "Vé máy bay", href: "#" },
  { label: "Khách sạn", href: "#" },
  { label: "Doanh nghiệp", href: "#" },
  { label: "Blog", href: "#" },
];

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: "#eee", py: 1 }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Box
          component="a"
          href="#"
          sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
        >
          <Box
            component="img"
            src="/images/logo.png"
            alt="Mixivivu Logo"
            sx={{ height: 80, mr: 2 }}
          />
          <Typography
            variant="h6"
            color="primary"
            fontWeight={700}
            fontFamily="'Pacifico', cursive"
            fontSize={20}
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
        {/* Login/Register */}
        <Stack direction="row" spacing={1} ml={3}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            sx={{ borderRadius: 20, textTransform: "none" }}
            startIcon={<LoginIcon />}
          >
            Đăng nhập
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ borderRadius: 20, textTransform: "none" }}
            startIcon={<PersonAddIcon />}
          >
            Đăng ký
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
