import Footer from "./layout/Footer";
import Header from "./layout/Header";
import BlogList from "../src/components/BlogList/BlogList"
import HomePage from "../src/page/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bloglist" element={<BlogList />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;