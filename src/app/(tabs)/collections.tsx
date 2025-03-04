import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "@/src/redux/slice/getProductSlice";
import Loader from "@/src/components/common/Loader";
import { colors } from "@/src/components/constants/colors";
import { fonts } from "@/src/components/constants/fonts";
import { MaterialIcons } from "@expo/vector-icons";
import { commonStyles } from "@/src/config/styles/commonStyles";
import { RootState } from "@/src/redux/store/store";

const Collections = ({ route }) => {
  // const { categoryTitle } = route.params;
  
  const dispatch = useDispatch();
  const [Products, setProducts] = useState()
  const { products, isLoading, error, hasNextPage, cursor } = useSelector(
    (state: RootState) => state.getProducts
  );
  const getCategoriesData = useSelector(
    (state: RootState) => state.getCategories
  );
  const categorys = getCategoriesData?.data?.edges.map((item) => item.node);
  console.log(categorys);
  
  useEffect(() => {
      // const trendingData = async () => {
      //     const trending = await response?.payload?.edges?.find((item) => item.node.title === categoryTitle);
      //     if (trending) {              
      //       setProducts(trending?.node?.products);
      //     }
      //   };
      //   trendingData();
    if (products.length === 0) {
      dispatch(getProducts());
    }
  }, [dispatch, products.length]);

  const handleLoadMore = () => {
    if (hasNextPage && cursor) {
      dispatch(getProducts(cursor));
    }
  };

  const renderProduct = ({ item }) => {
    const imageUrl = item.node?.images?.edges?.[0]?.node?.originalSrc;
    return (
      <View style={styles.productCard}>
        <Image source={{ uri: imageUrl }} style={styles.productImage} />
        <Text style={styles.productName}>{item.node.title}</Text>
        <View style={{ flexDirection: "row", gap: 10, marginVertical: 8 }}>
          <Text
            style={[
              styles.productPrice,
              { textDecorationLine: "line-through" },
            ]}
          >
            {`$ ${item.node.compareAtPriceRange.minVariantPrice.amount}`}
          </Text>
          <Text
            style={[styles.productPrice, { color: colors.colorTextSavings }]}
          >
            {`$ ${item.node.priceRange.minVariantPrice.amount}`}
          </Text>
        </View>
        <View style={styles.saleTag}>
          <Text style={styles.saleTagText}>Sale</Text>
        </View>
      </View>
    );
  };

  if (isLoading && products.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Loader />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {error}</Text>
        <Pressable onPress={() => dispatch(getProducts())}>
          <Text style={styles.retryButton}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.node.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.serviceList}
        ListFooterComponent={
          isLoading ? (
            <Loader />
          ) : hasNextPage ? (
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Pressable
                onPress={() => handleLoadMore()}
                style={styles.loadMore}
              >
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={32}
                  color={colors.black}
                />
              </Pressable>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  retryButton: {
    color: colors.primary,
    marginTop: 10,
    textDecorationLine: "underline",
  },
  serviceList: {
    gap: 20,
  },
  productCard: {
    flex: 1,
    margin: 10,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    width: "45%",
    height: "100%",
  },
  productImage: {
    width: "100%",
    height: 250,
  },
  productName: {
    fontSize: 14,
    fontFamily: fonts.regular,
    marginVertical: 8,
    textAlign: "center",
    letterSpacing: 0.5,
    width: "90%",
  },
  productPrice: {
    fontSize: 12,
    color: colors.gray,
    fontFamily: fonts.regular,
  },
  loadMore: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    borderRadius: 50,
  },
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

export default Collections;
