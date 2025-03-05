import React, { useState, useCallback } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";

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
      <View style={styles.productCard}>
        <Image source={{ uri: imageUrl }} style={styles.productImage} />
        <Text style={styles.productName}>{item.title}</Text>
        <View style={{ flexDirection: "row", gap: 10, marginVertical: 8 }}>
          <Text
            style={[
              styles.productPrice,
              { textDecorationLine: "line-through" },
            ]}
          >{`$ ${item.compareAtPriceRange.minVariantPrice.amount} `}</Text>
          <Text
            style={[styles.productPrice, { color: colors.colorTextSavings }]}
          >
            {`$ ${item.priceRange.minVariantPrice.amount} `}
          </Text>
        </View>
        <View style={styles.saleTag}>
          <Text style={styles.saleTagText}>{"Sale"}</Text>
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
      </View>
    );
  };

  return (
    <View style={styles.container}>
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
  container: {
    marginVertical: 10,
  },
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
