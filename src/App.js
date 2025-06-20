import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Login from "./auth/Login";
import Register from "./auth/Register";
import BlogDetail from "./components/Blog/BlogDetail";
import BlogList from "./components/Blog/BlogList";
import Enterprise from "./components/Enterprise/Enterprise";
import ProtectedRoute from "./components/routers/ProtectedRoute";
import AboutUs from "./layout/componentsFooter/AboutUs";
import ContactSection from "./layout/componentsFooter/ContactSection";
import FAQ from "./layout/componentsFooter/FAQ";
import PaymentMethods from "./layout/componentsFooter/PaymentMethods";
import PrivacyPolicy from "./layout/componentsFooter/PrivacyPolicy";
import RulesAndNotes from "./layout/componentsFooter/RulesAndNotes";
import TermsAndConditions from "./layout/componentsFooter/TermsAndConditions";
import UserGuide from "./layout/componentsFooter/UserGuide";
import CustomerProfile from "./layout/componentsHeader/CustomerProfile";
import MainLayout from "./layout/MainLayout";
import DetailBoat from "./pages/DetailBoat";
import FindBoat from "./pages/FindBoat";
import HomePage from "./pages/HomePage";
import { initializeAuth } from "./redux/asyncActions";
import { getTheme } from "./theme/theme";
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
