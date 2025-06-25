import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { getTheme } from "./theme/theme";
import HomePage from "./pages/HomePage";
import FindBoat from "./pages/FindBoat";
import Login from "./auth/Login";
import Register from "./auth/Register";
import CustomerProfile from "./layout/componentsHeader/CustomerProfile";
import AboutUs from "./layout/componentsFooter/AboutUs";
import TermsAndConditions from "./layout/componentsFooter/TermsAndConditions";
import PrivacyPolicy from "./layout/componentsFooter/PrivacyPolicy";
import UserGuide from "./layout/componentsFooter/UserGuide";
import PaymentMethods from "./layout/componentsFooter/PaymentMethods";
import ContactSection from "./layout/componentsFooter/ContactSection";
import Enterprise from "./components/Enterprise/Enterprise";
import BlogDetail from "./components/Blog/BlogDetail";
import BlogList from "./components/Blog/BlogList";
import DetailBoat from "./pages/DetailBoat";
import { useDispatch } from "react-redux";
import { initializeAuth } from "./redux/asyncActions";
import FAQ from "./layout/componentsFooter/FAQ";
import RulesAndNotes from "./layout/componentsFooter/RulesAndNotes";
import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./components/routers/ProtectedRoute";

//COMPANY
import Dashboard from "./components/company/Dashboard";
import ManageCompany from "./components/company/ManageCompany";
import ProfileCompany from "./components/company/Profile";
import ViewBooking from "./components/company/ViewBooking";
import ViewYacht from "./components/company/ViewYacht";

function App() {
  const [mode, setMode] = useState(
    localStorage.getItem("themeMode") || "light"
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Các route public/user */}
          <Route element={<MainLayout toggleTheme={toggleTheme} mode={mode} />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/find-boat" element={<FindBoat />} />
            <Route path="/boat-detail/:id" element={<DetailBoat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ve-chung-toi" element={<AboutUs />} />
            <Route
              path="/dieu-khoan-va-dieu-kien"
              element={<TermsAndConditions />}
            />
            <Route path="/chinh-sach-rieng-tu" element={<PrivacyPolicy />} />
            <Route path="/huong-dan-su-dung" element={<UserGuide />} />
            <Route path="/hinh-thuc-thanh-toan" element={<PaymentMethods />} />
            <Route path="/cau-hoi-thuong-gap" element={<FAQ />} />
            <Route
              path="/quy-dinh-chung-va-luu-y"
              element={<RulesAndNotes />}
            />
            <Route path="/lien-he-tu-van" element={<ContactSection />} />
            <Route path="/doanh-nghiep" element={<Enterprise />} />
            <Route path="/view-profile" element={<CustomerProfile />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
          </Route>

          {/* Các route company */}
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
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
