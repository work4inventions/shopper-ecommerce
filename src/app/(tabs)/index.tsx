import Categories from "@/src/components/Category";
import { colors } from "@/src/components/constants/colors";
import MyCarousel from "@/src/components/Slider";
import Trending from "@/src/components/Trending";
import { categoriesData } from "@/src/redux/slice/categoriesDataSlice";
import { getCategories } from "@/src/redux/slice/categoriesSlice";
import React, { useEffect } from "react";
import { Dimensions, ScrollView, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const dispatch = useDispatch();

  const id = "gid://shopify/Collection/322389541002";

  useEffect(() => {
    dispatch(getCategories());
    dispatch(categoriesData(id));
  }, []);

  return (
    <ScrollView
      style={styles.container}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
    >
      <MyCarousel />

      {/* Categories */}
      <Categories />

      {/* Products Grid */}
      <Trending />
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingTop: 20 },

});

export default HomeScreen;
