import { commonStyles } from "@/src/config/styles/commonStyles";
import { RootState } from "@/src/redux/store/store";
import { useNavigation } from "expo-router";
import React, { useCallback } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { fonts } from "../../constants/fonts";
import { SCREENS } from "../../constants/routes";

const Categories = () => {
  const navigation = useNavigation();
  const getCategoriesData = useSelector(
    (state: RootState) => state.getCategories
  );
  const categorys = getCategoriesData?.data?.edges?.map((item) => item.node) || [];

  const renderCategory = useCallback(({ item, index }) => (
    <Pressable
      key={`category-${item.id}-${index}`}
      style={styles.categoryItem}
      onPress={() => navigation.navigate(SCREENS.COLLECTIONS)}
    >
      <Image
        source={{ uri: item.image.originalSrc }}
        style={styles.categoryIcon}
        resizeMode="cover"
      />
      <Text style={styles.categoryText}>{item.title}</Text>
    </Pressable>
  ), [navigation]);

  if (!categorys?.length) return null;

  return (
    <View style={styles.container}>
      <Text style={commonStyles.sectionTitle}>Categories</Text>
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
    paddingTop: 20,
  },
  categoryList: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    alignItems: "center",
    width: 80,
    justifyContent: "center",
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: fonts.regular,
    textAlign: "center",
  },
});

export default Categories;
