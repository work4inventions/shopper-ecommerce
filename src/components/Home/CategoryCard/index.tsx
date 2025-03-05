import { commonStyles } from "@/src/config/styles/commonStyles";
import { RootState } from "@/src/redux/store/store";
import { BlurView } from "expo-blur";
import React, { useCallback } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  FlatList
} from "react-native";
import { useSelector } from "react-redux";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";

const CategoryCard = () => {
  const getCategoriesData = useSelector(
    (state: RootState) => state.getCategories
  );
  const categorys = getCategoriesData?.data?.edges?.map((item) => item.node) || [];

  const renderCategory = useCallback(({ item, index }) => (
    <ImageBackground
      key={`category-card-${item.id}-${index}`}
      source={{ uri: item.image.originalSrc }}
      resizeMode="cover"
      style={styles.productCard}
    >
      <BlurView intensity={10} tint="dark" style={styles.blurContainer}>
        <Text style={styles.categoryText}>{item.title}</Text>
      </BlurView>
    </ImageBackground>
  ), []);

  if (!categorys?.length) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={categorys}
        renderItem={renderCategory}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.categoryList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    marginVertical:20,
  },
  categoryList: {
    paddingHorizontal: 10,
  },
  productCard: {
    flex: 1,
    margin: 10,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    width: 250,
    height: 150,
    borderRadius: 10,
    overflow: "hidden",
  },
  blurContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  categoryText: {
    fontSize: 24,
    fontFamily: fonts.italic,
    color: colors.white,
    textAlign: "center",
    letterSpacing:1,
  },
});

export default CategoryCard;
