import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumbs, Container, Typography } from "@mui/material";
import { HouseFill } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import axios from "axios";
import ImageCarousel from "../components/DetailBoat/ImageCarousel";
import Tabs from "../components/DetailBoat/Tabs";
import RoomSelector from "../components/DetailBoat/RoomSelector";
import BoatInfo from "../components/DetailBoat/BoatInfo";
import ReviewSection from "../components/DetailBoat/ReviewSection";
import { Image } from "react-bootstrap";

function DetailBoat() {
  const { id } = useParams(); // Get the yacht ID from the URL
  const [yacht, setYacht] = useState(null); // State to store fetched yacht data
  const [activeTab, setActiveTab] = useState(0);
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: "Phòng Delta Suite",
      image: "./images/yacht-10.jpg",
      area: "33",
      beds: 2,
      price: 4150000,
      quantity: 0,
    },
    {
      id: 2,
      name: "Phòng Ocean Suite",
      image: "./images/yacht-10.jpg",
      area: "33",
      beds: 2,
      price: 4370000,
      quantity: 0,
    },
    {
      id: 3,
      name: "Phòng Captain Suite",
      image: "./images/yacht-10.jpg",
      area: "35",
      beds: 2,
      price: 4620000,
      quantity: 0,
    },
    {
      id: 4,
      name: "Phòng Regal Suite",
      image: "./images/yacht-10.jpg",
      area: "45",
      beds: 2,
      price: 4870000,
      quantity: 0,
    },
  ]);

  const sectionRefs = useRef({
    features: null,
    rooms: null,
    introduction: null,
    regulations: null,
    reviews: null,
  });

  // Fetch yacht data
  useEffect(() => {
    const fetchYacht = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9999/api/v1/yachts/findboat/${id}`
        );
        if (response.data.success) {
          setYacht(response.data.data);
        } else {
          console.error("Failed to fetch yacht data");
        }
      } catch (error) {
        console.error("Error fetching yacht:", error);
      }
    };

    fetchYacht();
  }, [id]);

  const handleDecrement = (id) => {
    setRooms(
      rooms.map((room) =>
        room.id === id
          ? { ...room, quantity: Math.max(0, room.quantity - 1) }
          : room
      )
    );
  };

  const handleIncrement = (id) => {
    setRooms(
      rooms.map((room) =>
        room.id === id ? { ...room, quantity: room.quantity + 1 } : room
      )
    );
  };

  const handleBookNow = () => {
    Swal.fire({
      title: "Đặt hàng thành công!",
      text: "Cảm ơn bạn đã đặt hàng với chúng tôi!",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const totalAmount = rooms.reduce(
    (total, room) => total + room.price * room.quantity,
    0
  );

  // Update active tab based on scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Object.keys(sectionRefs.current).indexOf(
              entry.target.id
            );
            if (index !== -1) {
              setActiveTab(index);
            }
          }
        });
      },
      { rootMargin: "-100px 0px 0px 0px", threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  if (!yacht) {
    return <div>Loading...</div>; // Display loading state while fetching data
  }

  return (
    <div className="font-archivo">
      <div className="border-b my-4 pb-2">
        <Container maxWidth="lg" className="py-1">
          <Breadcrumbs
            separator="›"
            aria-label="breadcrumb"
            className="flex gap-3"
          >
            <Link to="/" className="flex items-center hover:text-black">
              <HouseFill size={25} className="mr-2" />
            </Link>
            <Link
              to="/find-boat"
              className="flex items-center hover:text-gray-900"
            >
              Tìm du thuyền
            </Link>
            <Typography className="text-teal-800 hover:text-cyan-400">
              {yacht.name}
            </Typography>
          </Breadcrumbs>
        </Container>
      </div>
      <Container className="py-10 font-archivo">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-8/12">
            <h1 className="text-4xl font-bold text-gray-900">{yacht.name}</h1>
            <div className="flex items-center gap-2 my-5">
              <span className="bg-yellow-200 text-sm font-medium text-orange-800 rounded-2xl px-3 py-1 flex items-center">
                <svg
                  className="w-3 h-3 mr-1 fill-yellow-500"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                4.9 (12) đánh giá
              </span>
              <Link
                to="#"
                className="flex text-sm items-center bg-gray-100 text-gray-700 rounded-2xl px-3 py-1"
              >
                <span>{yacht.IdCompanys.address}</span>
                <span className="text-teal-400 underline pl-2">
                  Xem bản đồ và lịch trình
                </span>
              </Link>
            </div>
            <Image src="./images/heading-border.webp" className="my-4" />
          </div>
          <div className="md:w-4/12 flex flex-col">
            <p className="text-4xl font-bold text-teal-800">
              3,850,000 đ/khách
            </p>
          </div>
        </div>
      </Container>
      <ImageCarousel yachtId={id} /> {/* Pass yachtId to ImageCarousel */}
      <Container className="py-20">
        <div className="sticky top-24 z-10 bg-white">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="flex flex-col md:flex-row mt-10 gap-6">
          <div className="md:w-8/12">
            <div
              id="features"
              className="scroll-mt-32"
              ref={(el) => (sectionRefs.current.features = el)}
            >
              <h2 className="text-4xl font-bold text-gray-900">
                Đặc điểm nổi bật
              </h2>
              <img
                src="./images/heading-border.webp"
                alt="Divider"
                className="my-6"
              />
              <div className="flex gap-2 items-center my-10">
                <img src="./icons/Wine.svg" alt="Wine icon" />
                <p className="text-md font-medium">Quầy bar</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-teal-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M20 6L9 17l-5-5"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                    />
                  </svg>
                  <p className="text-base">{yacht.description}</p>
                </div>
              </div>
            </div>

            <div
              id="rooms"
              className="mt-16 scroll-mt-32"
              ref={(el) => (sectionRefs.current.rooms = el)}
            >
              <RoomSelector
                rooms={rooms}
                handleDecrement={handleDecrement}
                handleIncrement={handleIncrement}
                totalAmount={totalAmount}
                handleBookNow={handleBookNow}
              />
            </div>

            <div
              id="introduction"
              className="mt-16 scroll-mt-32"
              ref={(el) => (sectionRefs.current.introduction = el)}
            >
              <h2 className="text-4xl font-bold text-gray-900">Giới thiệu</h2>
              <img
                src="./images/heading-border.webp"
                alt="Divider"
                className="my-6"
              />
              <div className="text-base">
                <p className="text-2xl font-bold my-4">
                  Giới thiệu về du thuyền
                </p>
                <p className="my-2">{yacht.description}</p>
                <img src={yacht.image} alt={yacht.name} className="my-4" />
                <p className="my-2">
                  Du thuyền {yacht.name} có thiết kế tinh tế với thân vỏ làm từ{" "}
                  {yacht.hullBody}. Hành trình khám phá {yacht.itinerary} mang
                  đến trải nghiệm độc đáo giữa lòng {yacht.locationId.name}.
                </p>
              </div>
            </div>

            <div
              id="regulations"
              className="mt-16 scroll-mt-32"
              ref={(el) => (sectionRefs.current.regulations = el)}
            >
              <h2 className="text-4xl font-bold text-gray-900">
                Quy định chung và lưu ý
              </h2>
              <img
                src="./images/heading-border.webp"
                alt="Divider"
                className="my-6"
              />
              <p className="flex items-center gap-2 text-base font-medium">
                Bạn có thể xem Quy định chung và lưu ý:{" "}
                <Link
                  to="#"
                  className="flex items-center gap-2 text-teal-800 hover:text-teal-400"
                >
                  Tại đây{" "}
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M5 12h14M12 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </Link>
              </p>
            </div>

            <div id="faq" className="mt-16 scroll-mt-32">
              <h2 className="text-4xl font-bold text-gray-900">
                Câu hỏi thường gặp
              </h2>
              <img
                src="./images/heading-border.webp"
                alt="Divider"
                className="my-6"
              />
              <p className="flex items-center gap-2 text-base font-medium">
                Bạn có thể xem Câu hỏi thường gặp:{" "}
                <Link
                  to="#"
                  className="flex items-center gap-2 text-teal-800 hover:text-teal-400"
                >
                  Tại đây{" "}
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M5 12h14M12 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </Link>
              </p>
            </div>

            <div id="map" className="mt-16 scroll-mt-32">
              <h2 className="text-4xl font-bold text-gray-900">
                Bản đồ và lịch trình
              </h2>
              <img
                src="./images/heading-border.webp"
                alt="Divider"
                className="my-6"
              />
              <div className="space-y-4">
                <div className="relative bg-gray-100 text-gray-700 p-4 rounded-2xl shadow-sm border border-gray-300">
                  <div className="absolute top-2 right-2 cursor-pointer">
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M6 18L18 6M6 6l12 12"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className="flex">
                    <svg
                      className="w-6 h-6 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M12 16h.01M12 12h.01M12 8h.01"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium">Thông tin cần biết:</p>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>
                          Du thuyền {yacht.name} xuất phát từ{" "}
                          {yacht.IdCompanys.address}
                        </li>
                        <li>
                          Bạn có thể xem chi tiết lịch trình 2 ngày 1 đêm.{" "}
                          <Link
                            to="https://docs.google.com/document/d/1mEUXbaHQZmmjGfAuyuYHpRQimyt0y0YJRWjLZnvCa7U/edit?usp=sharing"
                            target="_blank"
                            rel="noreferrer"
                            className="text-teal-800 underline"
                          >
                            tại đây
                          </Link>
                          .
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <iframe
                  title="google-map"
                  width="100%"
                  height="332"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="border-0 rounded-3xl"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3726.7436108855272!2d106.98803167489945!3d20.922632380700293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a5ec6c1fba745%3A0xd8c824609119f9db!2zQ-G6o25nIHTDoHUga2jDoWNoIFF14buRYyB04bq_IFR14bqnbiBDaMOidQ!5e0!3m2!1svi!2s!4v1695975094490!5m2!1svi!2s"
                />
              </div>
            </div>

            <div
              id="reviews"
              className="mt-16 scroll-mt-32"
              ref={(el) => (sectionRefs.current.reviews = el)}
            >
              <ReviewSection />
            </div>
          </div>
          <BoatInfo yacht={yacht} /> {/* Pass yacht data to BoatInfo */}
        </div>
      </Container>
    </div>
  );
}

export default DetailBoat;
