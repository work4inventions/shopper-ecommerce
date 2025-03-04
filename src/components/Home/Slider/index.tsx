import React, { useRef, useState } from "react";
import { Dimensions, ImageBackground, Pressable, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import Typography from "../../common/Typography";
import { colors } from "../../constants/colors";
import { silder } from "../../constants/data";
import { fonts } from "../../constants/fonts";
const { width } = Dimensions.get("window");

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
    <Typography title={item.title} size={24} color={colors.primary} textStyle={{fontFamily:fonts.regular}}/>
        <Typography
          title={item.dec}
          size={12}
          textStyle={{ textAlign: "center", marginVertical: 10 }}
          color={colors.white}
        />
        <Pressable onPress={() => console.log("Shop Now")}>
          <Typography title="Shop Now" size={14} color={colors.white} textStyle={{textDecorationLine:'underline'}}/>
        </Pressable>
      </View>
    </ImageBackground>
  );

  const renderDots = () => {
    return silder.map((_, index) => {
      return (
        <View
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 6,
            marginHorizontal: 8,
            backgroundColor:
              activeIndex === index ? colors.primary : 'transparent',
            opacity: activeIndex === index ? 1 : 1,
            borderWidth: 1,
            borderColor: colors.primary,
          }}
        />
      );
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        ref={carouselRef}
        data={silder}
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
