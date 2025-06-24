import { CssBaseline, ThemeProvider } from "@mui/material";
import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom"; // thêm useLocation
import Login from "./auth/Login";
import Register from "./auth/Register";
import BlogDetail from "./components/Blog/BlogDetail";
import BlogList from "./components/Blog/BlogList";
import DetailBoat from "./components/DetailBoat/DetailBoat";
import Enterprise from "./components/Enterprise/Enterprise";
import Admin from './components/Admin/AdminDashboard';
import AboutUs from "./layout/componentsFooter/AboutUs";
import ContactSection from "./layout/componentsFooter/ContactSection";
import PaymentMethods from "./layout/componentsFooter/PaymentMethods";
import PrivacyPolicy from "./layout/componentsFooter/PrivacyPolicy";
import TermsAndConditions from "./layout/componentsFooter/TermsAndConditions";
import UserGuide from "./layout/componentsFooter/UserGuide";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import FindBoat from "./pages/FindBoat";
import HomePage from "./pages/HomePage";
import { getTheme } from "./theme/theme";
import { ToastContainer } from 'react-toastify';
import Dashboard from './components/company/Dashboard';
import ManageCompany from './components/company/ManageCompany';
import ProfileCompany from './components/company/Profile';
import ViewBooking from './components/company/ViewBooking';
import ViewYacht from './components/company/ViewYacht';
import ProtectedRoute from './components/routers/ProtectedRoute';

function App() {
  const [mode, setMode] = useState(localStorage.getItem("themeMode") || "light");
  const location = useLocation(); // lấy path hiện tại

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    localStorage.setItem("themeMode", newMode);
    setMode(newMode);
  };

  const theme = getTheme(mode);

  // Các path không hiển thị Header & Footer
  const hideHeaderFooter = ["/admin"].includes(location.pathname);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {!hideHeaderFooter && <Header toggleTheme={toggleTheme} mode={mode} />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/find-boat" element={<FindBoat />} />
        <Route path="/boat-detail" element={<DetailBoat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ve-chung-toi" element={<AboutUs />} />
        <Route path="/dieu-khoan-va-dieu-kien" element={<TermsAndConditions />} />
        <Route path="/chinh-sach-rieng-tu" element={<PrivacyPolicy />} />
        <Route path="/huong-dan-su-dung" element={<UserGuide />} />
        <Route path="/hinh-thuc-thanh-toan" element={<PaymentMethods />} />
        <Route path="/lien-he-tu-van" element={<ContactSection />} />
        <Route path="/doanh-nghiep" element={<Enterprise />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/manage-company" element={
          <ProtectedRoute>
            <ManageCompany />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="booking" element={<ViewBooking />} />
          <Route path="view-yacht" element={<ViewYacht />} />
          <Route path="profile" element={<ProfileCompany />} />
        </Route>
      </Routes>

      {!hideHeaderFooter && <Footer />}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ThemeProvider>
  );
}

export default App;
