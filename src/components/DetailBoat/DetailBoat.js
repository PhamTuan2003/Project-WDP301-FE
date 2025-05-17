import { StarOutline } from "@mui/icons-material";
import { Box, Breadcrumbs, Container, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import { HouseFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

function DetailBoat() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const images = [
    {
      src: "./images/ambassador/ambassador-cruise1.webp",
      alt: "Ambassador Cruise ship front view",
      thumbnail: "./images/ambassador/ambassador-cruise1.webp",
    },
    {
      src: "./images/ambassador/ambassador-cruise2.webp",
      alt: "Ha Long Bay scenery",
      thumbnail: "./images/ambassador/ambassador-cruise1.webp",
    },
    {
      src: "./images/ambassador/ambassador-cruise3.webp",
      alt: "Ambassador Cruise ship deck",
      thumbnail: "/api/placeholder/120/80",
    },
    {
      src: "./images/ambassador/ambassador-cruise4.webp",
      alt: "Cruise interior",
      thumbnail: "/api/placeholder/120/80",
    },
    {
      src: "./images/ambassador/ambassador-cruise5.webp",
      alt: "Ocean view from cruise",
      thumbnail: "/api/placeholder/120/80",
    },
  ];
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovering, currentIndex]);
  return (
    <>
      <div className="border-b my-4 items-center pb-2">
        <Container maxWidth="lg" sx={{ py: 1 }}>
          <Breadcrumbs
            className="cursor-pointer !gap-3"
            separator="›"
            aria-label="breadcrumb"
          >
            <Link
              underline="hover"
              color="inherit"
              to={"/"}
              className="!flex !items-center hover:text-black"
            >
              <HouseFill sx={{ mr: 0.5 }} size={25} fontSize="inherit" />
            </Link>
            <Link
              underline="hover"
              color="inherit"
              className="!flex  !items-center hover:text-gray-900"
              to={"/find-boat"}
            >
              Tìm du thuyền
            </Link>
            <Typography
              fontFamily={"Archivo, sans-serif"}
              className="!items-center !text-[#0e4f4f] hover:!text-cyan-400"
            >
              Du thuyền
            </Typography>
          </Breadcrumbs>
        </Container>
      </div>
      <div className="font-[Archivo,_sans-serif]">
        <Container className="container max-w-lg">
          <Row className="flex flex-1">
            <Col className="gap-16 flex-grow">
              <p className="font-bold text-gray-900 text-4xl ">
                Du Thuyền Heritage Bình Chuẩn Cát Bà{" "}
              </p>
              <Row className="items-center flex gap-2">
                {" "}
                <p className="bg-[#fedf89] w-fit my-5 p-[4px_12px] gap-1 to-inherit text-[#7a2e0e] text-sm font-medium rounded-2xl flex items-center">
                  {" "}
                  <StarOutline sx={{ fontSize: "12px", color: "#f79009" }} />
                  4.9 (12) đánh giá{" "}
                </p>
                <Link to={"#"}>
                  <div className="flex text-sm items-center p-[4px_12px] rounded-2xl flex-1 bg-gray-100 text-gray-700 ">
                    {" "}
                    <p className="">
                      {" "}
                      Cảng tàu quốc tế Hạ Long, Hạ Long, Quảng Ninh{" "}
                    </p>
                    <p className="text-[#77dada] underline  pl-2">
                      {" "}
                      Xem bản đồ và lịch trình
                    </p>
                  </div>
                </Link>
              </Row>
              <Row>
                <Col>
                  <Image src={"./images/heading-border.webp"} />
                </Col>
              </Row>
            </Col>
            <Col md={3}>
              <p className="text-[#0e4f4f] font-bold text-4xl">
                {" "}
                3,850,000 đ/khách
              </p>
            </Col>
          </Row>
        </Container>
        <Box
          className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-lg shadow-lg"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Main carousel */}
          <div className="relative h-96 md:h-[500px]">
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                  index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}

            {/* Ambassador Cruise branding overlay */}
            <div className="absolute z-20 flex flex-col items-center justify-center w-full bottom-0 bg-white bg-opacity-80 py-4">
              <h2 className="text-3xl font-bold tracking-widest text-gray-800">
                AMBASSADOR CRUISE
              </h2>
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 z-30 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 rounded-full p-2 transition-all duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 z-30 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 rounded-full p-2 transition-all duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          {/* Thumbnail indicators */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-16 w-16 md:h-20 md:w-20 overflow-hidden rounded-md transition-transform duration-300 ${
                  index === currentIndex
                    ? "border-2 border-white scale-110"
                    : "opacity-80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                <img
                  src={images[index].thumbnail}
                  alt={`Thumbnail ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </Box>
      </div>
    </>
  );
}

export default DetailBoat;
