import DetailBoat from "./components/DetailBoat/DetailBoat";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import FindBoat from "./pages/FindBoat";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/find-boat" element={<FindBoat />} />
          <Route path="/boat-detail" element={<DetailBoat />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
