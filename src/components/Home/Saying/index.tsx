import { truncateText } from "@/src/utils/commonUtils";
import { FontAwesome, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import React, { useCallback, useMemo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Carousel from "react-native-snap-carousel";
import Typography from "../../common/Typography";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { reviews } from "../../constants/data";

const service = [
  {
    id: 1,
    text: "Unique & high quality",
    icon: "diamond",
    IconComponent: FontAwesome,
  },
  {
    id: 2,
    text: "Free shipping over $35.00",
    icon: "airplane",
    IconComponent: Ionicons,
  },
  {
    id: 3,
    text: "100% secure checkout",
    icon: "lock",
    IconComponent: SimpleLineIcons,
  },
  {
    id: 4,
    text: "1 year jewelry warranty",
    icon: "shield-checkmark-outline",
    IconComponent: Ionicons,
  },
];

export default function Saying() {
  const renderItem = useCallback(({ item }) => (
    <View style={styles.slide}>
      <Text style={styles.reviewText}>"{truncateText(item.text, 160)}"</Text>
      <Text style={styles.author}>{item.author}</Text>
      <View style={styles.starContainer}>
        {Array.from({ length: item.rating }).map((_, i) => (
          <Ionicons key={`star-${i}`} name="star" size={16} color={colors.black} />
        ))}
      </View>
    </View>
  ), []);

  const renderService = useCallback(({ item }) => {
    const IconComponent = item.IconComponent;
    return (
      <View style={styles.serviceMain}>
        <IconComponent name={item.icon} size={24} color={colors.primary} />
        <Text style={styles.serviceText}>{item.text}</Text>
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const ServiceList = useMemo(() => (
    <FlatList
      data={service}
      renderItem={renderService}
      numColumns={2}
      showsHorizontalScrollIndicator={false}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.serviceList}
      columnWrapperStyle={styles.columnWrapper}
      scrollEnabled={false}
    />
  ), [renderService]);

  return (
    <View>
      <View style={styles.container}>
        <Typography textStyle={styles.header} title="WHAT PEOPLE ARE SAYING" />
        <View style={styles.sliderContainer}>
          <Carousel
            data={reviews}
            renderItem={renderItem}
            layout="stack"
            sliderWidth={350}
            itemWidth={280}
            loop
          />
        </View>
        <Text style={styles.footer}>OVER 700,000+ HAPPY CUSTOMERS</Text>
      </View>
      {ServiceList}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 18,
    color: colors.black,
    fontFamily: fonts.regular,
    marginBottom: 20,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  sliderContainer: {
    position: "relative",
    width: "100%",
    minHeight: 260,
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
    height: 250,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  reviewText: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
    fontFamily: fonts.regular,
    lineHeight: 24,
    color: colors.gray,
  },
  author: {
    fontSize: 14,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 12,
    fontFamily: fonts.regular,
  },
  starContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  footer: {
    fontSize: 12,
    letterSpacing: 1.2,
    color: colors.black,
    fontFamily: fonts.regular,
  },
  serviceList: {
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    padding: 15,
    marginVertical: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  serviceMain: {
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 10,
  },
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  serviceText: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: fonts.regular,
    textAlign: "center",
  },
});
