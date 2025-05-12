import { useEffect, useState, useRef } from "react";

const cards = [
  { id: 1, bgColor: "bg-amber-300", zIndex: 1, label: "111111111111" },
  { id: 2, bgColor: "bg-red-300", zIndex: 2, label: "2" },
  { id: 3, bgColor: "bg-blue-300", zIndex: 3, label: "3" },
  { id: 4, bgColor: "bg-green-300", zIndex: 4, label: "4" },
  { id: 5, bgColor: "bg-purple-300", zIndex: 5, label: "5" },
  { id: 6, bgColor: "bg-yellow-300", zIndex: 6, label: "6" },
  { id: 7, bgColor: "bg-amber-300", zIndex: 7, label: "7" },
  { id: 8, bgColor: "bg-red-300", zIndex: 8, label: "8" },
  { id: 9, bgColor: "bg-blue-300", zIndex: 9, label: "9" },
  { id: 10, bgColor: "bg-green-300", zIndex: 10, label: "10" },
  //   { id: 11, bgColor: "bg-purple-300", zIndex: 11, label: "11" },
  //   { id: 12, bgColor: "bg-yellow-300", zIndex: 12, label: "12" },
];




const CardItem = ({ color, label, isActive, index, translateZ }) => {
  // All cards have a fixed 30 degree rotation around Y axis
  // Only the translateZ and scale change based on active state
//   const translateZ = isActive ? 50 : 0;
  const scale = isActive ? 1 : 0.9;
  const translateX = -index * 8; // Dịch chuyển theo chiều ngang để tạo chéo
  const translateY = +index * 3;

  return (
    <div
      className={`w-[280px] h-[320px] ${color} flex items-center justify-center text-xl font-bold rounded-lg
         shadow-lg flex-shrink-0 transition-all duration-300`}
      style={{
        transform: `rotateY(48deg) translateZ(${translateZ}px) scale(${scale})
        translateX(${translateX}px) translateY(${translateY}px)
        `,
        transformStyle: "preserve-3d",
        marginLeft: index === 0 ? "0" : "-200px", // 50% overlap (280px / 2 = 140px)
        zIndex: isActive ? 10 : index, // Higher z-index for active cards
      }}
    >
      {label}
    </div>
  );
};

export default function CardSlider() {
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);

  // Number of visible cards
  const visibleCards = cards.length;

  // Handle mouse/touch down
  const handleDragStart = (e) => {
    if (!sliderRef.current) return;

    isDragging.current = true;
    startX.current = e.clientX || e.touches[0].clientX;
    scrollLeft.current = sliderRef.current.scrollLeft;

    // Change cursor style
    sliderRef.current.style.cursor = "grabbing";
    sliderRef.current.style.scrollBehavior = "auto";
  };

  // Handle mouse/touch move
  const handleDragMove = (e) => {
    if (!isDragging.current || !sliderRef.current) return;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    if (!clientX) return;

    const x = clientX - startX.current;
    sliderRef.current.scrollLeft = scrollLeft.current - x;
  };

  // Handle mouse/touch up
  const handleDragEnd = () => {
    isDragging.current = false;

    if (!sliderRef.current) return;

    // Restore cursor style
    sliderRef.current.style.cursor = "grab";
    sliderRef.current.style.scrollBehavior = "smooth";

    // Snap to the nearest card
    const cardWidth = 280 + 32; // card width + margin
    const scrollPosition = sliderRef.current.scrollLeft;
    const newIndex = Math.round(scrollPosition / cardWidth);

    // Update active index
    setActiveIndex(
      Math.min(Math.max(newIndex, 0), cards.length - visibleCards)
    );

    // Scroll to the snapped position
    sliderRef.current.scrollLeft = newIndex * cardWidth;
  };

  // Navigate to a specific index
  const navigateTo = (index) => {
    if (!sliderRef.current) return;

    const newIndex = Math.min(Math.max(index, 0), cards.length - visibleCards);
    console.log(newIndex);
    setActiveIndex(newIndex);

    const cardWidth = 280 + 32; // card width + margin
    sliderRef.current.scrollLeft = newIndex * cardWidth;
  };

  // Navigate to previous set of cards
  const navigatePrev = () => {
    navigateTo(activeIndex - 1);
  };

  // Navigate to next set of cards
  const navigateNext = () => {
    navigateTo(activeIndex + 1);
  };

  // Add event listeners
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    // Mouse events
    slider.addEventListener("mousedown", handleDragStart);
    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", handleDragEnd);

    // Touch events
    slider.addEventListener("touchstart", handleDragStart);
    window.addEventListener("touchmove", handleDragMove);
    window.addEventListener("touchend", handleDragEnd);

    return () => {
      // Clean up event listeners
      slider.removeEventListener("mousedown", handleDragStart);
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);

      slider.removeEventListener("touchstart", handleDragStart);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, []);

  // Check if a card is "active" (in the center of the viewport)
  const isCardActive = (index) => {
    return index >= activeIndex && index < activeIndex + visibleCards;
  };
  const calculatePosition = (index) => {
    const baseOffset = 10;
    const centerIndex = Math.floor(cards.length / 2);
    console.log((index - centerIndex) * (baseOffset / 2));
    return (index - centerIndex) * (baseOffset / 2);
  };

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="relative w-full max-w-[1500px] overflow-hidden">
        {/* Left navigation button */}

        {/* <button
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-3 shadow-md transition-opacity ${
            activeIndex <= 0
              ? "opacity-30 cursor-not-allowed"
              : "opacity-80 hover:opacity-100"
          } ${
            showControls || activeIndex > 0 ? "sm:opacity-80" : "sm:opacity-0"
          }`}
          onClick={navigatePrev}
          disabled={activeIndex <= 0}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button> */}

        {/* Card slider */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto scrollbar-hide cursor-grab select-none py-24"
          style={{
            perspective: "1000px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollBehavior: "smooth",
            transformStyle: "preserve-3d",
            paddingLeft: "calc(50% - 240px)", // Center the first card
            paddingRight: "calc(50% - 240px)", // Add space at the end
          }}
        >
          {/* Cards */}
          {cards.map((item, index) => (
            <CardItem
              key={item.id}
              color={item.bgColor}
              label={item.label}
              isActive={isCardActive(index)}
              index={index}
              translateZ={calculatePosition(index)}
            />
          ))}
        </div>

        {/* Right navigation button */}
        {/* <button
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-3 shadow-md transition-opacity ${
            activeIndex >= cards.length - visibleCards
              ? "opacity-30 cursor-not-allowed"
              : "opacity-80 hover:opacity-100"
          } ${
            showControls || activeIndex < cards.length - visibleCards
              ? "sm:opacity-80"
              : "sm:opacity-0"
          }`}
          onClick={navigateNext}
          disabled={activeIndex >= cards.length - visibleCards}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button> */}


      </div>

      {/* Pagination indicators */}
      {/* <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: cards.length - visibleCards + 1 }).map(
          (_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                activeIndex === index
                  ? "bg-gray-800 w-6"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => navigateTo(index)}
            />
          )
        )}
      </div> */}
    </div>
  );
}
