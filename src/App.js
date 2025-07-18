import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getTheme } from "./theme/theme";
import { useDispatch, useSelector } from "react-redux";
import { initializeAuth } from "./redux/asyncActions";
import { openTransactionModal, closeTransactionModal } from "./redux/actions";

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
import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./components/routers/ProtectedRoute";

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

// Modals
import InvoiceModal from "./components/DetailBoat/Booking/InvoiceModal";
import TransactionModal from "./components/DetailBoat/Booking/TransactionModal";
import ConfirmationModal from "./components/DetailBoat/Booking/ConfirmationModal";

// Custom hook để lock scroll khi có modal mở
function useBodyScrollLock() {
  const showTransactionModal = useSelector((state) => state.ui.modals.showTransactionModal);
  const showConfirmationModal = useSelector((state) => state.ui.modals.showConfirmationModal);
  // Nếu có thêm modal khác, thêm vào đây
  useEffect(() => {
    if (showTransactionModal || showConfirmationModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showTransactionModal, showConfirmationModal]);
}

function AppWrapper() {
  const [mode, setMode] = useState(localStorage.getItem("themeMode") || "light");
  const dispatch = useDispatch();
  const showTransactionModal = useSelector((state) => state.ui.modals.showTransactionModal);
  const bookingIdFortransaction = useSelector((state) => state.ui.modals.bookingIdFortransaction);
  const showConfirmationModal = useSelector((state) => state.ui.modals.showConfirmationModal);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Sửa: chỉ mở lại modal khi load app, không phụ thuộc showTransactionModal
  useEffect(() => {
    const bookingId = localStorage.getItem("bookingIdForTransaction");
    if (bookingId) {
      dispatch(openTransactionModal(bookingId));
    }
  }, [dispatch]);

  useBodyScrollLock();

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
      <Routes>
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
            <ProtectedRoute allowedRoles={["COMPANY"]}>
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
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Admin toggleTheme={toggleTheme} mode={mode} />
            </ProtectedRoute>
          }
        />
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

      {/* Global Modals */}
      <InvoiceModal />
      {showTransactionModal && <TransactionModal />}
      <ConfirmationModal />
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
