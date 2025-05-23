import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

function ImageCarousel({ yachtId }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [mainImages, setMainImages] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);

  // Fallback image in case the API returns no images
  const fallbackImages = [
    { src: "./images/yacht-8.jpg", alt: "Default Yacht Image" },
  ];

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9999/api/v1/yachtImages/yacht/${yachtId}`
        );
        const images = response.data.data || [];
        if (images.length > 0) {
          // Map the imageUrl array to the required format
          const imageList = images.map((url, idx) => ({
            src: url,
            alt: `Yacht image ${idx + 1}`,
          }));
          setMainImages(imageList);
          setThumbnails(images);
        } else {
          // Use fallback images if no images are returned
          setMainImages(fallbackImages);
          setThumbnails(fallbackImages.map((img) => img.src));
        }
      } catch (err) {
        console.error(`Error fetching images for yacht ${yachtId}:`, err);
        // Use fallback images on error
        setMainImages(fallbackImages);
        setThumbnails(fallbackImages.map((img) => img.src));
      }
    };

    if (yachtId) {
      fetchImages();
    }
  }, [yachtId]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === mainImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? mainImages.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isHovering && mainImages.length > 1) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovering, currentIndex, mainImages.length]);

  // Hide navigation buttons if only one image
  const showNavigation = mainImages.length > 1;

  return (
    <div className="w-full mt-10 overflow-hidden">
      <div className="flex px-6">
        <div className="w-1/6 relative flex items-center justify-center">
          <img
            src={
              mainImages.length > 0 ? mainImages[0].src : fallbackImages[0].src
            }
            alt={
              mainImages.length > 0 ? mainImages[0].alt : fallbackImages[0].alt
            }
            className="object-cover w-full rounded-l-3xl h-[300px]"
          />
          {showNavigation && (
            <button
              onClick={prevSlide}
              className="absolute z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
          )}
        </div>
        <div
          className="w-4/6 relative flex items-center justify-center"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {mainImages.map((image, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full px-6 transition-opacity duration-500 ease-in-out ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="object-cover w-full h-[300px]"
              />
            </div>
          ))}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
            {thumbnails.map((thumb, index) => (
              <div
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-16 w-16 overflow-hidden cursor-pointer border-2 rounded-xl ${
                  index === currentIndex
                    ? "border-white"
                    : "border-transparent opacity-80"
                }`}
              >
                <img
                  src={thumb}
                  alt={`Thumbnail ${index + 1}`}
                  className="object-cover w-full rounded-xl h-full"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/6 relative flex items-center justify-center">
          <img
            src={
              mainImages.length > 1
                ? mainImages[1].src
                : mainImages.length > 0
                ? mainImages[0].src
                : fallbackImages[0].src
            }
            alt={
              mainImages.length > 1
                ? mainImages[1].alt
                : mainImages.length > 0
                ? mainImages[0].alt
                : fallbackImages[0].alt
            }
            className="object-cover w-full rounded-r-3xl h-[300px]"
          />
          {showNavigation && (
            <button
              onClick={nextSlide}
              className="absolute z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageCarousel;
