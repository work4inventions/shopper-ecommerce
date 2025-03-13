import React from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import Typography from "../../common/Typography";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { router } from "expo-router";

const Product = ({ getCategorieData }: any) => {
  const categorys = getCategorieData?.edges?.map((item) => item.node) || [];

  const toggleLike = (id) => {
    setProductList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, liked: !item.liked } : item
      )
    );
  };

  const renderProduct = ({ item }) => {
    const imageUrl = item.images?.edges?.[0]?.node?.originalSrc;
    return (
      <Pressable style={styles.productCard}  onPress={() => router.push({
          pathname: "/productDetail",
          params: { item: JSON.stringify(item) },
        })}>
        <Image source={{ uri: imageUrl }} style={styles.productImage} />
        <Typography title={item.title} textStyle={styles.productName} />
        <View style={{ flexDirection: "row", gap: 10, marginVertical: 8 }}>
          <Typography
            title={`$ ${item.compareAtPriceRange.minVariantPrice.amount} `}
            textStyle={[
              styles.productPrice,
              { textDecorationLine: "line-through" },
            ]}
          />
          <Typography
            title={`$ ${item.priceRange.minVariantPrice.amount} `}
            textStyle={[
              styles.productPrice,
              { color: colors.colorTextSavings },
            ]}
          />
        </View>
        <View style={styles.saleTag}>
          <Typography title="Sale" textStyle={styles.saleTagText} />
        </View>
        {/* <TouchableOpacity
          onPress={() => toggleLike(item.id)}
          style={styles.likeButton}
        >
          <AntDesign
            name={item.liked ? "heart" : "hearto"}
            size={20}
            color="red"
          />
        </TouchableOpacity> */}
      </Pressable>
    );
  };

  return (
    <View>
      <FlatList
        data={categorys}
        renderItem={renderProduct}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
  },
  sectionTitle: { fontSize: 18, fontFamily: fonts.bold, margin: 15 },
  productCard: {
    flex: 1,
    margin: 10,
    backgroundColor: colors.primaryLight,
    paddingBottom: 10,
    alignItems: "center",
    width: 250,
    height: "100%",
  },
  productImage: { width: "100%", height: 250 },
  productName: {
    fontSize: 14,
    fontFamily: fonts.regular,
    marginVertical: 8,
    textAlign: "center",
    letterSpacing: 0.5,
    width: "80%",
  },
  productPrice: { fontSize: 12, color: colors.gray, fontFamily: fonts.regular },
  priceContainer: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 8,
  },
  comparePrice: {
    textDecorationLine: "line-through",
    color: colors.gray,
  },
  currentPrice: {
    color: colors.colorTextSavings,
  },
  likeButton: { position: "absolute", top: 5, right: 5 },
  saleTag: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: colors.black,
    padding: 5,
  },
  saleTagText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fonts.regular,
    letterSpacing: 1,
  },
});

export default Product;
