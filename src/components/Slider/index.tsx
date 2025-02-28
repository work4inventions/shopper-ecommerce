import React, { useRef, useState } from "react";
import { View, Text, Image, Dimensions, ImageBackground, Pressable } from "react-native";
import Carousel from "react-native-snap-carousel";
import { images } from "../constants/images";
import { colors } from "../constants/colors";
import Typography from "../common/Typography";

const { width } = Dimensions.get("window");

const data = [
  {
    id: "1",
    title: "New Waterproof Jewelry",
    dec: "Shower, exercise or swim with tarnish-free jewelry made from stainless steel.",
    image: images.slider1,
  },
  { 
    id: "2", 
    title: "Elegant Watch Collection", 
    dec: "Explore our range of premium watches for every occasion.", 
    image: images.slider2 
  },
  { 
    id: "3", 
    title: "Classic Gold Rings", 
    dec: "Timeless designs made from high-quality gold for your everyday look.", 
    image: images.slider3 
  },
];

const MyCarousel = () => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSnapToItem = (index) => {
    setActiveIndex(index);
  };

  const renderItem = ({ item }) => (
    <ImageBackground
      source={item.image}
      resizeMode="cover"
      style={{
        width: "100%",
        height: 200,
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          backgroundColor: colors.blackOpacity,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
          paddingHorizontal: 20,
        }}
      >
        <Typography title={item.title} size={24} color={colors.primery}/>
        <Typography
          title={item.dec}
          size={12}
          textStyle={{ textAlign: "center", marginVertical: 10 }}
        />
        <Pressable onPress={() => console.log("Shop Now")}>
          <Typography title="Shop Now" size={14} color={colors.white} textStyle={{textDecorationLine:'underline'}}/>
        </Pressable>
      </View>
    </ImageBackground>
  );

  const renderDots = () => {
    return data.map((_, index) => {
      return (
        <View
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 6,
            marginHorizontal: 8,
            backgroundColor:
              activeIndex === index ? colors.primery : colors.primeryLight,
            opacity: activeIndex === index ? 1 : 0.6,
          }}
        />
      );
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        ref={carouselRef}
        data={data}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width * 0.8}
        loop
        autoplay
        autoplayInterval={3000}
        onSnapToItem={handleSnapToItem}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        {renderDots()}
      </View>
    </View>
  );
};

export default MyCarousel;
