import React, { useState, useEffect } from 'react';
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
    Divider,
    Paper,
    Grid,
    Card,
    CardContent,
    Avatar
} from '@mui/material';
import {
    Search as SearchIcon,
    Notifications as NotificationsIcon,
    AccountCircle,
    AttachMoney,
    CalendarToday,
    Dashboard as DashboardIcon,
    ChevronLeft,
    ChevronRight
} from '@mui/icons-material';
import CompanyManagement from './CompanyManagement';
import RevenueSummary from './RevenueSummary';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';

export default function Dashboard() {
    const [open, setOpen] = useState(true);
    const drawerWidthOpen = 240;
    const drawerWidthClosed = 72;
    const drawerWidth = open ? drawerWidthOpen : drawerWidthClosed;
    const [selectedMenu, setSelectedMenu] = useState("dashboard");

    // Thêm state cho dữ liệu dashboard
    const [stats, setStats] = useState(null);

    // Gọi API khi load component
    const [companyCount, setCompanyCount] = useState(0);

    useEffect(() => {
        fetch("http://localhost:9999/api/v1/count-companies/count")
            .then(res => res.json())
            .then(data => setCompanyCount(data.count));
    }, []);
    useEffect(() => {
        fetch("http://localhost:9999/admin/stats")
            .then(res => res.json())
            .then(data => setStats(data));
    }, []);
    const [earningsByMonth, setEarningsByMonth] = useState([]);

    useEffect(() => {
        // Gọi API lấy dữ liệu doanh thu từng tháng từ backend
        fetch("http://localhost:9999/api/v1/account-companies/revenue/monthly")
            .then(res => res.json())
            .then(data => setEarningsByMonth(data));
    }, []);

    // Tính tổng hoa hồng admin nhận được từ earningsByMonth
    const totalCommission = earningsByMonth.reduce(
        (sum, row) => sum + (row.earnings * 0.05), 0
    );

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh" bgcolor="#f5f7fa" fontFamily="'Inter', sans-serif">

            {/* AppBar/Header */}
            <AppBar position="static" sx={{ bgcolor: '#fff', boxShadow: '0 2px 8px #e0e0e0' }}>
                <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
                    <Typography variant="h6" fontWeight="700" color="primary.main" letterSpacing={1}>
                        Admin Dashboard
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Paper
                            component="form"
                            sx={{
                                p: '2px 8px',
                                display: 'flex',
                                alignItems: 'center',
                                width: 250,
                                borderRadius: '8px',
                                bgcolor: '#f5f7fa',
                                boxShadow: 'none'
                            }}
                        >
                            <SearchIcon sx={{ color: 'primary.main' }} />
                            <InputBase
                                placeholder="Search…"
                                sx={{ ml: 1, flex: 1, color: 'primary.main' }}
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Paper>
                        <IconButton color="primary"><NotificationsIcon /></IconButton>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>A</Avatar>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Content Area with Drawer and Main Content */}
            <Box display="flex" flexGrow={1}>
                {/* Sidebar */}
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            bgcolor: '#fff',
                            borderRight: 'none',
                            borderRadius: open ? '0 24px 24px 0' : '0 16px 16px 0',
                            boxShadow: '2px 0 12px #e0e0e0',
                            transition: 'width 0.3s',
                            top: 'auto'
                        }
                    }}
                >
                    <Toolbar sx={{ px: 2, justifyContent: open ? 'space-between' : 'center', minHeight: 64 }}>
                        {open && (
                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="h6" color="primary.main" fontWeight={700}>Longwave</Typography>
                            </Box>
                        )}
                        <IconButton onClick={() => setOpen(!open)}>
                            {open ? <ChevronLeft /> : <ChevronRight />}
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List>
                        <ListItem
                            button
                            selected={selectedMenu === "dashboard"}
                            onClick={() => setSelectedMenu("dashboard")}
                            sx={{
                                borderRadius: 2,
                                mx: 1,
                                my: 0.5,
                                '&.Mui-selected': {
                                    bgcolor: 'primary.light',
                                    color: 'primary.main'
                                },
                                '&:hover': {
                                    bgcolor: 'primary.lighter'
                                }
                            }}
                        >
                            <ListItemIcon>
                                <DashboardIcon color={selectedMenu === "dashboard" ? "primary" : "action"} />
                            </ListItemIcon>
                            {open && <ListItemText primary="Dashboard" />}
                        </ListItem>

                        <ListItem
                            button
                            selected={selectedMenu === "company"}
                            onClick={() => setSelectedMenu("company")}
                            sx={{
                                borderRadius: 2,
                                mx: 1,
                                my: 0.5,
                                '&.Mui-selected': {
                                    bgcolor: 'primary.light',
                                    color: 'primary.main'
                                },
                                '&:hover': {
                                    bgcolor: 'primary.lighter'
                                }
                            }}
                        >
                            <ListItemIcon>
                                <AccountCircle color={selectedMenu === "company" ? "primary" : "action"} />
                            </ListItemIcon>
                            {open && <ListItemText primary="Company" />}
                        </ListItem>
                        <ListItem
                            button
                            selected={selectedMenu === "revenue"}
                            onClick={() => setSelectedMenu("revenue")}
                            sx={{
                                borderRadius: 2,
                                mx: 1,
                                my: 0.5,
                                '&.Mui-selected': {
                                    bgcolor: 'primary.light',
                                    color: 'primary.main'
                                },
                                '&:hover': {
                                    bgcolor: 'primary.lighter'
                                }
                            }}
                        >
                            <ListItemIcon>
                                <AttachMoney color={selectedMenu === "revenue" ? "primary" : "action"} />
                            </ListItemIcon>
                            {open && <ListItemText primary="Doanh thu" />}
                        </ListItem>
                    </List>
                </Drawer>

                {/* Main content */}
                <Box flexGrow={1} p={4} overflow="auto">
                    {selectedMenu === "dashboard" && (
                        <>
                            <Grid container spacing={4} justifyContent="center">
                                {/* Customer Card */}
                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 24px #e0e0e0', p: 1, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px) scale(1.03)' } }}>
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary">Customers</Typography>
                                                    <Typography variant="h4" color="error.main" fontWeight={700}>
                                                        {stats ? stats.customer : '...'}
                                                    </Typography>
                                                    <Typography variant="body2" color="success.main">+28% performance</Typography>
                                                </Box>
                                                <Avatar sx={{ bgcolor: 'error.light', width: 48, height: 48 }}>
                                                    <CalendarToday color="error" fontSize="large" />
                                                </Avatar>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                {/* Companies Card */}
                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 24px #e0e0e0', p: 1, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px) scale(1.03)' } }}>
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary">Total Companies</Typography>
                                                    <Typography variant="h4" color="primary.main" fontWeight={700}>
                                                        {companyCount}
                                                    </Typography>
                                                    <Typography variant="body2" color="success.main">+12% this month</Typography>
                                                </Box>
                                                <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48 }}>
                                                    <AccountCircle color="primary" fontSize="large" />
                                                </Avatar>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                {/* Earnings Card */}
                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 24px #e0e0e0', p: 1, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px) scale(1.03)' } }}>
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary">Earnings (Commission)</Typography>
                                                    <Typography variant="h4" color="primary.main" fontWeight={700}>
                                                        {totalCommission.toLocaleString()} đ
                                                    </Typography>
                                                    <Typography variant="body2" color="success.main">+10% this month</Typography>
                                                </Box>
                                                <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48 }}>
                                                    <AttachMoney color="primary" fontSize="large" />
                                                </Avatar>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                            {/* Earnings Chart */}
                            <Box mt={15} display="flex" justifyContent="center">
                                <Box width="100%" maxWidth={900}>
                                    <Typography variant="h6" fontWeight={600} mb={2}>Earnings & Commission by Month</Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={earningsByMonth.map(row => ({
                                                ...row,
                                                commission: row.earnings * 0.5 // hoặc 0.05 nếu muốn đúng thực tế
                                            }))}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis
                                                domain={[0, 'dataMax + 1000000']} // hoặc tăng/giảm số này cho phù hợp dữ liệu của bạn
                                                tickCount={8} // số lượng mức chia trên trục tung
                                            />
                                            <Tooltip />
                                            <Bar dataKey="earnings" fill="#1976d2" name="Booking Earnings" />
                                            <Line type="monotone" dataKey="commission" stroke="#ff9800" strokeWidth={3} name="Commission (50%)" dot />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Box>
                        </>
                    )}
                    {selectedMenu === "company" && <CompanyManagement />}
                    {selectedMenu === "revenue" && (
                        <RevenueSummary data={earningsByMonth} />
                    )}
                </Box>
            </Box>
        </Box>
    );
}
