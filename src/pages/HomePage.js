import React from "react";
import theme from "../theme/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Header from "../layout/Header";
import Banner from "../components/HomePages/Banner";
import CruiseList from "../components/HomePages/CruiseList";
import Review from "../components/HomePages/Review";
import Destination from "../components/HomePages/Destination";
import Partners from "../components/HomePages/Partners";
import NewsList from "../components/HomePages/NewsList";
import Footer from "../layout/Footer";

function HomePage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <main
        style={{
          background: "linear-gradient(180deg, #f8f9fa 0%, #c7daca 100%)",
        }}
      >
        <Banner />
        <CruiseList />
        <Review />
        <Destination />
        <Partners />
        <NewsList />
      </main>
    </ThemeProvider>
  );
}

export default HomePage;
