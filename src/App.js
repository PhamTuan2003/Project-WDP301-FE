import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getTheme } from "./theme/theme";
import { useDispatch, useSelector } from "react-redux";
import { initializeAuth } from "./redux/asyncActions";
import { openTransactionModal } from "./redux/actions";

// Pages & Components
import HomePage from "./pages/HomePage";
import FindBoat from "./pages/FindBoat";
import DetailBoat from "./pages/DetailBoat";
import Login from "./auth/Login";
import Register from "./auth/Register";
import CustomerProfile from "./layout/componentsHeader/CustomerProfile";
import ChangePassword from "./layout/componentsHeader/ChangePassword";
import BookingHistory from "./pages/BookingHistory";
import BlogList from "./components/Blog/BlogList";
import BlogDetail from "./components/Blog/BlogDetail";

// Footer Info Pages
import AboutUs from "./layout/componentsFooter/AboutUs";
import TermsAndConditions from "./layout/componentsFooter/TermsAndConditions";
import PrivacyPolicy from "./layout/componentsFooter/PrivacyPolicy";
import UserGuide from "./layout/componentsFooter/UserGuide";
import PaymentMethods from "./layout/componentsFooter/PaymentMethods";
import ContactSection from "./layout/componentsFooter/ContactSection";
import FAQ from "./layout/componentsFooter/FAQ";
import RulesAndNotes from "./layout/componentsFooter/RulesAndNotes";

// Layout & Routing
import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./components/routers/ProtectedRoute";
// import Footer from "./layout/Footer";
// import Header from "./layout/Header";

// Company
import Dashboard from "./components/company/Dashboard";
import ManageCompany from "./components/company/ManageCompany";
import ProfileCompany from "./components/company/Profile";
import ViewBooking from "./components/company/ViewBooking";
import ViewYacht from "./components/company/ViewYacht";

// Enterprise
import Enterprise from "./components/Enterprise/Enterprise";

// Admin
import Admin from "./components/Admin/AdminDashboard";

function AppWrapper() {
  const [mode, setMode] = useState(localStorage.getItem("themeMode") || "light");
  const dispatch = useDispatch();
  const { showTransactionModal, bookingIdFortransaction } = useSelector(
    (state) => state.ui.modals
  );

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    const bookingId = localStorage.getItem("bookingIdForTransaction");
    if (
      bookingId &&
      (!showTransactionModal || bookingIdFortransaction !== bookingId)
    ) {
      dispatch(openTransactionModal(bookingId));
    }
  }, [dispatch, showTransactionModal, bookingIdFortransaction]);

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    localStorage.setItem("themeMode", newMode);
    setMode(newMode);
  };

  const theme = getTheme(mode);
  // const hideHeaderFooter = ["/admin"].includes(location.pathname);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* {!hideHeaderFooter && <Header toggleTheme={toggleTheme} mode={mode} />} */}
      <Routes>
        {/* User & Public Routes */}
        <Route element={<MainLayout toggleTheme={toggleTheme} mode={mode} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/find-boat" element={<FindBoat />} />
          <Route path="/boat-detail/:id" element={<DetailBoat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/ve-chung-toi" element={<AboutUs />} />
          <Route path="/dieu-khoan-va-dieu-kien" element={<TermsAndConditions />} />
          <Route path="/chinh-sach-rieng-tu" element={<PrivacyPolicy />} />
          <Route path="/huong-dan-su-dung" element={<UserGuide />} />
          <Route path="/hinh-thuc-thanh-toan" element={<PaymentMethods />} />
          <Route path="/cau-hoi-thuong-gap" element={<FAQ />} />
          <Route path="/quy-dinh-chung-va-luu-y" element={<RulesAndNotes />} />
          <Route path="/lien-he-tu-van" element={<ContactSection />} />
          <Route path="/doanh-nghiep" element={<Enterprise />} />
          <Route path="/view-profile" element={<CustomerProfile />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
        </Route>

        {/* Company Routes */}
        <Route
          path="/manage-company"
          element={
            <ProtectedRoute>
              <ManageCompany />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="booking" element={<ViewBooking />} />
          <Route path="view-yacht" element={<ViewYacht />} />
          <Route path="profile" element={<ProfileCompany />} />
        </Route>

        {/* Admin Route */}
        <Route path="/admin" element={<Admin toggleTheme={toggleTheme} mode={mode} />} />
      </Routes>

      {/* {!hideHeaderFooter && <Footer />} */}

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
        theme={mode}
      />
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
