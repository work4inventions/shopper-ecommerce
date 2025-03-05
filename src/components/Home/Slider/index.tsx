import React, { useRef, useState, useCallback } from "react";
import { Dimensions, ImageBackground, Pressable, View, StyleSheet } from "react-native";
import Carousel from "react-native-snap-carousel";
import Typography from "../../common/Typography";
import { colors } from "../../constants/colors";
import { silder } from "../../constants/data";
import { fonts } from "../../constants/fonts";
const { width } = Dimensions.get("window");

const MyCarousel = () => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const renderItem = useCallback(({ item }) => (
    <ImageBackground
      source={item.image}
      resizeMode="cover"
      style={styles.slideImage}
    >
      <View style={styles.overlay}>
        <Typography 
          title={item.title} 
          size={24} 
          color={colors.primary} 
          textStyle={styles.title}
        />
        <Typography
          title={item.dec}
          size={12}
          textStyle={styles.description}
          color={colors.white}
        />
        <Pressable onPress={() => console.log("Shop Now")}>
          <Typography 
            title="Shop Now" 
            size={14} 
            color={colors.white} 
            textStyle={styles.shopNow}
          />
        </Pressable>
      </View>
    </ImageBackground>
  ), []);

  const renderDots = useCallback(() => (
    <View style={styles.dotsContainer}>
      {silder.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            activeIndex === index && styles.activeDot
          ]}
        />
      ))}
    </View>
  ), [activeIndex]);

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={silder}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width * 0.8}
        loop
        autoplay
        autoplayInterval={3000}
        onSnapToItem={setActiveIndex}
      />
      {renderDots()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slideImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
  },
  overlay: {
    backgroundColor: colors.blackOpacity,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: fonts.regular,
  },
  description: {
    textAlign: "center",
    marginVertical: 10,
  },
  shopNow: {
    textDecorationLine: 'underline',
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 6,
    marginHorizontal: 8,
    backgroundColor: 'transparent',
    opacity: 1,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
});

export default MyCarousel;
