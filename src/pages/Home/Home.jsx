import CardSlider from "@/components/CardSlider/CardSlider";
import "./Home.css";
import CardSlider2 from "@/components/CardSlider2/CardSlider2";

const cards = [
  { id: 1, bgColor: "bg-amber-300", zIndex: 1, label: "1" },
  { id: 2, bgColor: "bg-red-300", zIndex: 2, label: "2" },
  { id: 3, bgColor: "bg-blue-300", zIndex: 3, label: "3" },
  { id: 4, bgColor: "bg-green-300", zIndex: 4, label: "4" },
  { id: 5, bgColor: "bg-purple-300", zIndex: 5, label: "5" },
  { id: 6, bgColor: "bg-yellow-300", zIndex: 6, label: "6" },

  { id: 7, bgColor: "bg-amber-300", zIndex: 7, label: "1" },
  { id: 8, bgColor: "bg-red-300", zIndex: 8, label: "2" },
  { id: 9, bgColor: "bg-blue-300", zIndex: 9, label: "3" },
  { id: 10, bgColor: "bg-green-300", zIndex: 10, label: "4" },
  { id: 11, bgColor: "bg-purple-300", zIndex: 11, label: "5" },
  { id: 12, bgColor: "bg-yellow-300", zIndex: 12, label: "6" },
];

const CardItem = ({ index, zIndex, color, position, label }) => {
  return (
    <div
      className={`w-[280px] h-[320px] ${color} flex items-center justify-center text-xl font-bold absolute`}
      style={{
        transform: `rotateY(30deg) translateZ(${position}px)`,
        transformStyle: "preserve-3d",
        zIndex: zIndex,
      }}
    >
      {label}
    </div>
  );
};

// const CardItem = ({ color, label, isActive, index }) => {
//   // All cards have a fixed 30 degree rotation around Y axis
//   // Only the translateZ and scale change based on active state
//   const translateZ = isActive ? 50 : 0;
//   const scale = isActive ? 1 : 0.9;

//   return (
//     <div
//       className={`w-[280px] h-[320px] ${color} flex items-center justify-center text-xl font-bold rounded-lg
//          shadow-lg flex-shrink-0 transition-all duration-300`}
//       style={{
//         transform: `rotateY(30deg) translateZ(${translateZ}px) scale(${scale})`,
//         transformStyle: "preserve-3d",
//         marginLeft: index === 0 ? "0" : "-150px", // 50% overlap (280px / 2 = 140px)
//         zIndex: isActive ? 10 : index, // Higher z-index for active cards
//       }}
//     >
//       {label}
//     </div>
//   );
// };

export const Home = () => {
  // Tính toán vị trí Z cho các card
  const calculatePosition = (index) => {
    const baseOffset = 200;
    const centerIndex = Math.floor(cards.length / 2);
    console.log((index - centerIndex) * (baseOffset / 2));
    return (index - centerIndex) * (baseOffset / 2);
  };

  return (
    // <div
    //   className="flex mx-auto max-w-screen w-screen h-screen items-center justify-center
    //   overflow-x-auto scrollbar-hide cursor-grab select-none py-12"
    //   // style={{ perspective: "1500px" }}
    //   // className="flex overflow-x-auto scrollbar-hide cursor-grab select-none py-12"
    //   style={{
    //     perspective: "1000px",
    //     scrollbarWidth: "none",
    //     msOverflowStyle: "none",
    //     scrollBehavior: "smooth",
    //     transformStyle: "preserve-3d",
    //     // paddingLeft: "calc(50% - 240px)", // Center the first card
    //     // paddingRight: "calc(50% - 240px)", // Add space at the end
    //   }}
    // >
    //   {cards.map((item, index) => (
    //     <CardItem
    //       key={item.id}
    //       index={index}
    //       zIndex={item.zIndex}
    //       color={item.bgColor}
    //       position={calculatePosition(index)}
    //       label={item.label}
    //     />
    //   ))}
    //   <CardSlider/>
    // </div>
    <div className="">
      <CardSlider2/>
      
    </div>
  );
};
