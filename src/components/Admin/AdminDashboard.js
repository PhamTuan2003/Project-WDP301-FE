import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  AttachMoney,
  CalendarToday,
  Dashboard as DashboardIcon,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { AiOutlineMoon, AiOutlineSun } from "react-icons/ai";
import CompanyManagement from "./CompanyManagement";
import RevenueSummary from "./RevenueSummary";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard({ toggleTheme, mode }) {
  const [open, setOpen] = useState(true);
  const drawerWidthOpen = 240;
  const drawerWidthClosed = 72;
  const drawerWidth = open ? drawerWidthOpen : drawerWidthClosed;
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [companyCount, setCompanyCount] = useState(0);
  const [earningsByMonth, setEarningsByMonth] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [yearOptions, setYearOptions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:9999/api/v1/companies/count")
      .then((res) => res.json())
      .then((data) => setCompanyCount(data.count));
  }, []);

  useEffect(() => {
    fetch("http://localhost:9999/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  useEffect(() => {
    fetch("http://localhost:9999/api/v1/companies/revenue/monthly")
      .then((res) => res.json())
      .then((data) => {
        setEarningsByMonth(data);
      });
  }, []);

  useEffect(() => {
    if (earningsByMonth.length > 0) {
      const years = Array.from(new Set(earningsByMonth.map((row) => row.year))).sort((a, b) => b - a);
      setYearOptions(years);
      if (!years.includes(selectedYear)) setSelectedYear(years[0]);
    }
  }, [earningsByMonth]);

  const filteredData = earningsByMonth.filter((row) => row.year === selectedYear);
  const totalCommission = filteredData.reduce((sum, row) => sum + row.earnings * 0.05, 0);

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      bgcolor={(theme) => theme.palette.background.default}
      fontFamily="'Inter', sans-serif"
    >
      <AppBar
        position="static"
        sx={{
          bgcolor: (theme) => theme.palette.background.paper,
          boxShadow: (theme) => theme.shadows[1],
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: 64,
          }}
        >
          <Typography variant="h6" fontWeight="800" color={(theme) => theme.palette.primary.main} letterSpacing={1}>
            Admin Dashboard
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Paper
              component="form"
              sx={{
                p: "2px 8px",
                display: "flex",
                alignItems: "center",
                width: 250,
                borderRadius: (theme) => theme.shape.borderRadius,
                bgcolor: (theme) => theme.palette.background.default,
                boxShadow: "none",
              }}
            >
              <SearchIcon sx={{ color: (theme) => theme.palette.primary.main }} />
              <InputBase
                placeholder="Search…"
                sx={{
                  ml: 1,
                  flex: 1,
                  color: (theme) => theme.palette.text.primary,
                }}
                inputProps={{ "aria-label": "search" }}
              />
            </Paper>
            <IconButton onClick={toggleTheme} sx={{ color: (theme) => theme.palette.text.primary, p: 1 }}>
              {mode === "light" ? <AiOutlineMoon size={24} /> : <AiOutlineSun size={24} />}
            </IconButton>
            <IconButton color="primary">
              <NotificationsIcon />
            </IconButton>
            <Avatar
              sx={{
                bgcolor: (theme) => theme.palette.primary.main,
                width: 36,
                height: 36,
              }}
            >
              A
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Box display="flex" flexGrow={1}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: (theme) => theme.palette.background.paper,
              borderRight: "none",
              borderRadius: open ? "0 24px 24px 0" : "0 16px 16px 0",
              boxShadow: (theme) => theme.shadows[1],
              transition: "width 0.3s",
              top: "auto",
            },
          }}
        >
          <Toolbar
            sx={{
              px: 2,
              justifyContent: open ? "space-between" : "center",
              minHeight: 64,
            }}
          >
            {open && (
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h6" color={(theme) => theme.palette.primary.main} fontWeight={700}>
                  𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮
                </Typography>
              </Box>
            )}
            <IconButton onClick={() => setOpen(!open)}>{open ? <ChevronLeft /> : <ChevronRight />}</IconButton>
          </Toolbar>
          <Divider
            sx={{
              height: 0.004,
              backgroundColor: (theme) => theme.palette.text.primary,
              opacity: 0.5,
              my: 2,
            }}
          />
          <List>
            {/* Dashboard */}
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedMenu === "dashboard"}
                onClick={() => setSelectedMenu("dashboard")}
                sx={{
                  borderRadius: 1.5,
                  mx: 1,
                  my: 0.5,
                  "&.Mui-selected": {
                    bgcolor: (theme) => theme.palette.primary.light,
                    color: (theme) => theme.palette.text.primary,
                  },
                  "&:hover": {
                    bgcolor: (theme) => theme.palette.primary.lighter,
                  },
                }}
              >
                <ListItemIcon>
                  <DashboardIcon color={selectedMenu === "dashboard" ? "primary" : "action"} />
                </ListItemIcon>
                {open && <ListItemText primary="Dashboard" />}
              </ListItemButton>
            </ListItem>

            {/* Company */}
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedMenu === "company"}
                onClick={() => setSelectedMenu("company")}
                sx={{
                  borderRadius: 1.5,
                  mx: 1,
                  my: 0.5,
                  "&.Mui-selected": {
                    bgcolor: (theme) => theme.palette.primary.light,
                    color: (theme) => theme.palette.text.primary,
                  },
                  "&:hover": {
                    bgcolor: (theme) => theme.palette.primary.lighter,
                  },
                }}
              >
                <ListItemIcon>
                  <AccountCircle color={selectedMenu === "company" ? "primary" : "action"} />
                </ListItemIcon>
                {open && <ListItemText primary="Company" />}
              </ListItemButton>
            </ListItem>

            {/* Revenue */}
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedMenu === "revenue"}
                onClick={() => setSelectedMenu("revenue")}
                sx={{
                  borderRadius: 1.5,
                  mx: 1,
                  my: 0.5,
                  "&.Mui-selected": {
                    bgcolor: (theme) => theme.palette.primary.light,
                    color: (theme) => theme.palette.text.primary,
                  },
                  "&:hover": {
                    bgcolor: (theme) => theme.palette.primary.lighter,
                  },
                }}
              >
                <ListItemIcon>
                  <AttachMoney color={selectedMenu === "revenue" ? "primary" : "action"} />
                </ListItemIcon>
                {open && <ListItemText primary="Doanh thu" />}
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>

        <Box flexGrow={1} p={4} overflow="auto" sx={{ backgroundColor: (theme) => theme.palette.background.default }}>
          {selectedMenu === "dashboard" && (
            <>
              <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      borderRadius: (theme) => theme.shape.borderRadius,
                      boxShadow: (theme) => theme.shadows[1],
                      p: 1,
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px) scale(1.03)",
                      },
                    }}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle2" color={(theme) => theme.palette.text.secondary}>
                            Khách hàng
                          </Typography>
                          <Typography variant="h4" color={(theme) => theme.palette.error.main} fontWeight={700}>
                            {stats ? stats.customer : "..."}
                          </Typography>
                          <Typography variant="body2" color={(theme) => theme.palette.text.secondary}>
                            Cập nhật:{" "}
                            {new Date().toLocaleString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </Typography>
                        </Box>
                        <Avatar
                          sx={{
                            bgcolor: (theme) => theme.palette.primary.dark,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <AccountCircle color="primary" fontSize="large" />
                        </Avatar>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      borderRadius: (theme) => theme.shape.borderRadius,
                      boxShadow: (theme) => theme.shadows[1],
                      p: 1,
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px) scale(1.03)",
                      },
                    }}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle2" color={(theme) => theme.palette.text.secondary}>
                            Tất cả công ty
                          </Typography>
                          <Typography variant="h4" color={(theme) => theme.palette.primary.main} fontWeight={700}>
                            {companyCount}
                          </Typography>
                          <Typography variant="body2" color={(theme) => theme.palette.text.secondary}>
                            Cập nhật:{" "}
                            {new Date().toLocaleString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </Typography>
                        </Box>
                        <Avatar
                          sx={{
                            bgcolor: (theme) => theme.palette.error.light,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <CalendarToday color="error" fontSize="large" />
                        </Avatar>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      borderRadius: (theme) => theme.shape.borderRadius,
                      boxShadow: (theme) => theme.shadows[1],
                      p: 1,
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px) scale(1.03)",
                      },
                    }}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle2" color={(theme) => theme.palette.text.secondary}>
                            Thu nhập (Hoa hồng)
                          </Typography>
                          <Typography variant="h4" color={(theme) => theme.palette.primary.main} fontWeight={700}>
                            {totalCommission.toLocaleString()} đ
                          </Typography>
                          <Typography variant="body2" color={(theme) => theme.palette.text.secondary}>
                            Cập nhật:{" "}
                            {new Date().toLocaleString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </Typography>
                        </Box>
                        <Avatar
                          sx={{
                            bgcolor: (theme) => theme.palette.primary.dark,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <AttachMoney color="primary" fontSize="large" />
                        </Avatar>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Chart */}
              <Box
                mt={15}
                display="flex"
                justifyContent="center"
                sx={{ backgroundColor: (theme) => theme.palette.background.paper }}
              >
                <Box width="100%" maxWidth={1400}>
                  <Typography variant="h6" fontWeight={600} mb={2} color={(theme) => theme.palette.text.primary}>
                    Thu nhập và hoa hồng theo tháng
                  </Typography>
                  <Box
                    mb={2}
                    display="flex"
                    alignItems="center"
                    gap={2}
                    sx={{ backgroundColor: (theme) => theme.palette.background.paper }}
                  >
                    <FormControl size="small">
                      <InputLabel sx={{ color: (theme) => theme.palette.text.primary }}>Năm</InputLabel>
                      <Select
                        value={selectedYear}
                        label="Năm"
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        sx={{
                          minWidth: 100,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: (theme) => theme.shape.borderRadius,
                          },
                        }}
                      >
                        {yearOptions.map((y) => (
                          <MenuItem key={y} value={y} sx={{ color: (theme) => theme.palette.text.primary }}>
                            {y}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  {filteredData.length > 0 && (
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart
                        data={filteredData.map((row) => ({
                          ...row,
                          commission: row.earnings * 0.05,
                        }))}
                        margin={{ left: 80, right: 80, top: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={(theme) => theme.palette.divider} />
                        <XAxis dataKey="month" stroke={(theme) => theme.palette.text.primary} />
                        <YAxis
                          yAxisId="left"
                          label={{
                            value: "Earnings (đ)",
                            angle: -90,
                            position: "outsideLeft",
                            dx: -50,
                            style: { textAnchor: "middle", fontSize: 12, color: (theme) => theme.palette.text.primary },
                          }}
                          stroke={(theme) => theme.palette.text.primary}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          label={{
                            value: "Commission (đ)",
                            angle: -90,
                            position: "outsideRight",
                            dx: 50,
                            style: { textAnchor: "middle", fontSize: 12, color: (theme) => theme.palette.text.primary },
                          }}
                          stroke={(theme) => theme.palette.text.primary}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: (theme) => theme.palette.background.paper, borderRadius: 4 }}
                          itemStyle={{ color: (theme) => theme.palette.text.primary }}
                        />
                        <Bar
                          yAxisId="left"
                          dataKey="earnings"
                          fill={(theme) => theme.palette.primary.main}
                          name="Booking Earnings"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="commission"
                          stroke={(theme) => theme.palette.purple.main}
                          strokeWidth={3}
                          dot
                          name="Commission (5%)"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </Box>
              </Box>
            </>
          )}

          {selectedMenu === "company" && <CompanyManagement />}
          {selectedMenu === "revenue" && <RevenueSummary data={earningsByMonth} />}
        </Box>
      </Box>
    </Box>
  );
}
