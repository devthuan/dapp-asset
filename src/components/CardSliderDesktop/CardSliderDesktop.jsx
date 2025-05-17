import { useEffect, useState, useRef } from "react";
import AssetDetail from "@/pages/AssetDetail/AssetDetail";
import AssetForm from "../AssetForm/AssetForm";
import ImgCard from "@/assets/car.webp";
import AssetDetailDesktop from "@/pages/AssetDetail/AssetDetailDesktop";
import { useDispatch } from "react-redux";
import { initId } from "@/redux/features/asset/assetSlice";

// CSS for water ripple effect
const waterEffectCSS = `
@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.4;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.water-ripple {
  position: absolute;
  border-radius: 12px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 70%, rgba(59, 130, 246, 0) 100%);
  animation: ripple 1.2s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  pointer-events: none;
}
`;

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
];

const CardItem = ({
  asset,
  isActive,
  index,
  translateZ,
  onClick,
  animationState,
  animationDelay,
  waterEffect,
}) => {
  const cardRef = useRef(null);
  // Calculate scale based on animation state
  let scale = isActive ? 1 : 0.96;

  // Apply scale animation based on animation state
  if (animationState === "ending") {
    scale = isActive ? 1.05 : 1.01; // Start with larger scale when animation is ending
  }

  const translateX = -index * 8;
  const translateY = +index * 4;

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`relative w-[230px] h-[280px] bg-gray-200/80 flex items-center justify-center text-xl font-bold rounded-lg
      shadow-lg flex-shrink-0 ${
        animationState === "ending" ? "card-bounce" : ""
      }`}
      style={{
        transform: `rotateY(48deg) translateZ(${translateZ}px) scale(${scale})
        translateX(${translateX}px) translateY(${translateY}px)`,
        transformStyle: "preserve-3d",
        marginLeft: index === 0 ? "0" : "-150px",
        zIndex: isActive ? 10 : index,
        transition: `all ${
          animationState === "ending" ? 300 : 150
        }ms ${animationDelay}ms ${
          animationState === "ending"
            ? "cubic-bezier(0.34, 1.56, 0.64, 1)"
            : "ease-out-in"
        }`,
      }}
    >
      {waterEffect && isActive && (
        <div
          className="water-ripple absolute inset-0"
          style={{
            width: "100%",
            height: "100%",
            animationDelay: `${animationDelay}ms`,
          }}
        />
      )}

      <img src={asset.imageURL} alt="" srcSet="" />
    </div>
  );
};

const CardItemSelected = ({
  asset,
  isActive,
  index,
  translateZ,
  onClick,
  animationState,
  animationDelay,
  waterEffect,
}) => {
  // Calculate scale based on animation state
  let scale = isActive ? 1 : 0.96;

  // Apply scale animation based on animation state
  if (animationState === "ending") {
    scale = isActive ? 1.1 : 1.02; // Start with larger scale when animation is ending
  }

  const translateX = -130;
  const translateY = +index * 4;

  return (
    <div
      onClick={onClick}
      className={`relative w-[230px] h-[280px] bg-gray-200/90 flex items-center justify-center text-xl font-bold rounded-lg
          shadow-lg flex-shrink-0`}
      style={{
        transform: `rotateY(48deg) translateZ(${translateZ}px) scale(${scale})
          translateX(${translateX}px) translateY(${translateY}px)
          `,
        transformStyle: "preserve-3d",
        marginLeft: index === 0 ? "0" : "-150px",
        zIndex: isActive ? 10 : index,
        // transition: `all ${
        //   animationState === "ending" ? 300 : 150
        // }ms ${animationDelay}ms ${
        //   animationState === "ending"
        //     ? "cubic-bezier(0.34, 1.56, 0.64, 1)"
        //     : "ease-out"
        // }`,
      }}
    >
      {waterEffect && isActive && (
        <div
          className="water-ripple absolute inset-0"
          style={{
            width: "100%",
            height: "100%",
            animationDelay: `${animationDelay}ms`,
          }}
        />
      )}
      <img src={asset.imageURL} alt="" srcset="" />
    </div>
  );
};

export default function CardSliderDesktop({ data, reloadAssets, onClick }) {
  const dispatch = useDispatch();
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const [animationState, setAnimationState] = useState("idle"); // "idle", "dragging", "ending"
  const [waterEffect, setWaterEffect] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);
  const [dataAsset, setDataAsset] = useState(data);
  const dragStartTime = useRef(0);
  const dragEndTime = useRef(0);

  // const [selectedAssetId, setSelectedAssetId] = useState(null); // 👈 ID được chọn
  const [formAssetId, setFormAssetId] = useState(null);

  // Number of visible cards
  const visibleCards = cards.length;

  // Handle mouse/touch down
  const handleDragStart = (e) => {
    if (!sliderRef.current) return;

    isDragging.current = true;
    setIsDraggingState(true);
    setAnimationState("dragging");
    startX.current = e.clientX || e.touches[0].clientX;
    scrollLeft.current = sliderRef.current.scrollLeft;
    dragStartTime.current = Date.now();
    setWaterEffect(false);
    setDragDistance(0);

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
    setDragDistance(Math.abs(x)); // Track how far the user dragged
    sliderRef.current.scrollLeft = scrollLeft.current - x;
  };

  // Trigger end animation sequentially
  const triggerEndAnimation = () => {
    // Set animation state to "ending" to trigger the scale animation
    setAnimationState("ending");

    // Only apply water effect if drag was significant
    dragEndTime.current = Date.now();
    const dragDuration = dragEndTime.current - dragStartTime.current;
    const dragVelocity = dragDistance / dragDuration;

    // Apply water effect if drag was significant or quick
    if (dragDistance > 30 || dragVelocity > 0.5) {
      setWaterEffect(true);

      // Reset water effect after animation completes
      setTimeout(() => {
        setWaterEffect(false);
      }, 1200);
    }

    // Reset animation state after animation completes
    setTimeout(() => {
      setAnimationState("idle");
    }, 500); // Allow time for all animations to complete
  };

  // Handle mouse/touch up
  const handleDragEnd = () => {
    if (!isDragging.current) return;

    isDragging.current = false;
    setIsDraggingState(false);

    if (!sliderRef.current) return;

    // Restore cursor style
    sliderRef.current.style.cursor = "grab";
    sliderRef.current.style.scrollBehavior = "smooth";

    // Trigger the end animation
    triggerEndAnimation();

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

  const handleOnclick = (data) => {
    if (data.id === selected) {
      setSelected(null);
    } else {
      setSelected(data.id);
    }

    dispatch(initId({id: data.id}))
    
    setSelected(data.id);
    // navigate("/detail");
  };

  // init data
  useEffect(() => {
    setDataAsset(data);

    console.log(dataAsset);
  }, []);

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
    const baseOffset = 13;
    const centerIndex = Math.floor(cards.length / 2);
    return (index - centerIndex) * (baseOffset / 2);
  };

  // Calculate animation delay based on card index and active index
  const getAnimationDelay = (index) => {
    // Calculate distance from active index
    const distance = Math.abs(index - activeIndex);

    // Cards closer to active index animate first
    return distance * 50; // 50ms delay between each card
  };

  const handleCloseDetails = () => {
    setSelected(null);
  };

  const handleOpenForm = (id) => {
    setFormAssetId(id);
    setSelected(null);
  };

  const handleCloseForm = () => {
    setFormAssetId(null);
  };

  return (
    <div
      className="w-full flex flex-col items-center justify-center from-gray-50 to-gray-100"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Inject CSS for water effect */}
      <style>{waterEffectCSS}</style>

      <div className="relative w-full max-w-[1500px] overflow-hidden">
        {/* Card slider */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto scrollbar-hide cursor-grab select-none pt-8  pb-20"
          style={{
            perspective: "1000px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollBehavior: "smooth",
            transformStyle: "preserve-3d",
            paddingLeft: "calc(50% - 70px)", // Center the first card
            paddingRight: "calc(50% - 170px)", // Add space at the end
          }}
        >
          {/* Cards */}
          {data.map((item, index) => {
            const isActive = isCardActive(index);
            const animationDelay = getAnimationDelay(index);

            return (
              <CardItem
                asset={item}
                onClick={() => handleOnclick(item)}
                key={item.id}
                isActive={isActive}
                index={index}
                translateZ={calculatePosition(index)}
                animationState={animationState}
                animationDelay={animationDelay}
                waterEffect={waterEffect}
              />
            );
          })}
        </div>
      </div>

      <div className="hidden">
        <AssetDetailDesktop
          id={selected}
          onClose={handleCloseDetails}
          onEdit={handleOpenForm}
          reloadAssets={reloadAssets}
        />
      </div>

      {formAssetId !== null && (
        <AssetForm id={formAssetId} onClose={handleCloseForm} />
      )}
    </div>
  );
}
