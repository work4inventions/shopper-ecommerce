import { commonStyles } from "@/src/config/styles/commonStyles";
import { RootState } from "@/src/redux/store/store";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import Typography from "../../common/Typography";
import { fonts } from "../../constants/fonts";

const Categories = () => {
  const router = useRouter();
  const getCategoriesData = useSelector(
    (state: RootState) => state.getCategories
  );
  const categorys =
    getCategoriesData?.data?.edges?.map((item) => item.node) || [];

  const renderCategory = useCallback(
    ({ item, index }) => (
      <Pressable
        key={`category-${item.id}-${index}`}
        style={styles.categoryItem}
        onPress={() =>
          router.replace({
            pathname: "/collections",
            params: { item: JSON.stringify(item) },
          })
        }
      >
        <Image
          source={{ uri: item.image.originalSrc }}
          style={styles.categoryIcon}
          resizeMode="cover"
        />
        <Typography textStyle={styles.categoryText} title={item.title} />
      </Pressable>
    ),
    [router]
  );

  if (!categorys?.length) return null;

  return (
    <View style={styles.container}>
      <Typography textStyle={commonStyles.sectionTitle} title={"Categories"} />
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
