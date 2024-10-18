import React, {useEffect} from 'react';
import NewYearCanvas from './NewYearCanvas';
import ReactGA from 'react-ga';

function App() {

  useEffect(()=>{
    ReactGA.pageview(window.location.pathname);
  },[])

  const clothColors = [
      { colorName: "Baby Pink", colorCode: "#FFC0CB" },
      { colorName: "Black", colorCode: "#000000" },
      { colorName: "Bottle Green", colorCode: "#345C4D" },
      { colorName: "Brown", colorCode: "#6F3000" },
      { colorName: "Emerald", colorCode: "#0F6060" },
      { colorName: "Grey", colorCode: "#808080" },
      { colorName: "Hot pink", colorCode: "#FF3090" },
      { colorName: "Lime", colorCode: "#9AC151" },
      { colorName: "Maroon", colorCode: "#800000" },
      { colorName: "Natural", colorCode: "#FFF0C0" },
      { colorName: "Navy", colorCode: "#121F42" },
      { colorName: "Olive", colorCode: "#6F6030" },
      { colorName: "Orange", colorCode: "#FF8C00" },
      { colorName: "Purple", colorCode: "#8B008B" },
      { colorName: "Red", colorCode: "#FF0000" },
      { colorName: "Royal", colorCode: "#0000CD" },
      { colorName: "Sky blue", colorCode: "#87CEEB" },
      { colorName: "Stone", colorCode: "#D2B48C" },
      { colorName: "Turquoise", colorCode: "#1E90FF" },
      { colorName: "White", colorCode: "#FFFFFF" },
      { colorName: "Yellow", colorCode: "#FFF600" }
    ];

  const stickers = [
    { alt: "1-1_outline-black_bg-na_light-black", src: "./images/logo/1-1_outline-black_bg-na_light-black.png" },
    { alt: "1-2_outline-black_bg-na_light-blue", src: "./images/logo/1-2_outline-black_bg-na_light-blue.png" },
    { alt: "1-3_outline-black_bg-na_light-green", src: "./images/logo/1-3_outline-black_bg-na_light-green.png" },
    { alt: "1-4_outline-black_bg-na_light-red", src: "./images/logo/1-4_outline-black_bg-na_light-red.png" },
    { alt: "1-5_outline-black_bg-na_light-yellow", src: "./images/logo/1-5_outline-black_bg-na_light-yellow.png" },
    { alt: "1-6_outline-black_bg-sa_light-black", src: "./images/logo/1-6_outline-black_bg-sa_light-black.png" },
    { alt: "2-1_outline-black_bg-white_light-black", src: "./images/logo/2-1_outline-black_bg-white_light-black.png" },
    { alt: "3-1_outline-white_bg-black_light-white", src: "./images/logo/3-1_outline-white_bg-black_light-white.png" },
    { alt: "4-1_outline-white_bg-na_light-white", src: "./images/logo/4-1_outline-white_bg-na_light-white.png" },
    { alt: "4-2_outline-white_bg-na_light-yellow", src: "./images/logo/4-2_outline-white_bg-na_light-yellow.png" }
]

  return (
    <div className="App">
      <NewYearCanvas stickers={stickers} colors={clothColors}/>
    </div>
  );
}

export default App;
