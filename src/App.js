import React from "react";
import Header from "./layout/Header";
import Banner from "./components/Banner";
import CruiseList from "./components/CruiseList";
import Review from "./components/Review";
import Destination from "./components/Destination";
import Partners from "./components/Partners";
import NewsList from "./components/NewsList";
import Footer from "./layout/Footer";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <main style={{ background: 'linear-gradient(180deg, #f8f9fa 0%, #c7daca 100%)' }}>
        <Banner />
        <CruiseList />
        <Review />
        <Destination />
        <Partners />
        <NewsList />
      </main>
      <Footer />
    </ThemeProvider>
  );
}

export default App;