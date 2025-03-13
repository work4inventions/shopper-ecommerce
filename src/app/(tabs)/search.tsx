import Loader from "@/src/components/common/Loader";
import Typography from "@/src/components/common/Typography";
import { colors } from "@/src/components/constants/colors";
import { fonts } from "@/src/components/constants/fonts";
import {
  resetSearchProducts,
  searchProducts,
} from "@/src/redux/slice/searchProductsSlice";
import { truncateText } from "@/src/utils/commonUtils";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { search, isLoading, hasNextPage, cursor } = useSelector(
    (state: any) => state.searchProducts
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(resetSearchProducts());
    }, [])
  );

  const fetchProducts = () => {
    if (!searchTerm) return;
    dispatch(resetSearchProducts());
    dispatch(searchProducts({ searchTerm, cursor: null }));
  };

  const loadMoreProducts = () => {
    if (!hasNextPage || isLoading) return;
    dispatch(searchProducts({ searchTerm, cursor }));
  };

  const ListFooterComponent = useMemo(() => {
    if (isLoading) {
      return <Loader />;
    }
    if (hasNextPage) {
      return (
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable onPress={loadMoreProducts} style={styles.loadMore}>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={32}
              color={colors.black}
            />
          </Pressable>
        </View>
      );
    }
    return null;
  }, [isLoading, hasNextPage, loadMoreProducts]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search for products..."
          value={searchTerm}
          placeholderTextColor={colors.gray}
          onChangeText={setSearchTerm}
          returnKeyType="search"
          onSubmitEditing={fetchProducts}
        />

        <Pressable onPress={fetchProducts} style={styles.searchBtn}>
          <Typography title="Search" textStyle={styles.searchBtnText} />
        </Pressable>
      </View>

      <KeyboardAwareScrollView
        style={styles.productMain}
        showsVerticalScrollIndicator={false}
      >
        <FlatList
          data={search}
          keyExtractor={(item, index) => item.node.id + index}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={styles.productItem}
              onPress={() =>
                router.push({
                  pathname: "/productDetail",
                  params: { item: JSON.stringify(item.node) },
                })
              }
            >
              <View style={styles.productImage}>
                <Image
                  source={{
                    uri: item?.node?.images?.edges?.[0]?.node?.originalSrc,
                  }}
                  style={styles.productImg}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.node.title}</Text>
                <Typography
                  title={truncateText(item?.node?.description, 150)}
                  size={13}
                  color={colors.gray}
                  textStyle={{ width: "95%" }}
                />
                <View style={styles.priceContainer}>
                  <Typography
                    title={`$ ${item?.node?.priceRange?.minVariantPrice?.amount} `}
                    textStyle={[
                      styles.productPrice,
                      { textDecorationLine: "line-through" },
                    ]}
                  />
                  <Typography
                    title={`$  ${item?.node?.compareAtPriceRange?.minVariantPrice?.amount} `}
                    textStyle={[
                      styles.productPrice,
                      { color: colors.colorTextSavings },
                    ]}
                  />
                </View>
              </View>
              <View style={styles.saleTag}>
                <Typography title="Sale" textStyle={styles.saleTagText} />
              </View>
            </Pressable>
          )}
          ListFooterComponent={ListFooterComponent}
          onEndReached={loadMoreProducts}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            !isLoading ? (
              <Typography
                title="No products found."
                size={14}
                color={colors.gray}
                textStyle={{ textAlign: "center", padding: 20 }}
              />
            ) : null
          }
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchBar: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    color: colors.black,
    padding: 10,
    marginBottom: 10,
    width: "77%",
    height: 40,
  },
  searchBtn: {
    backgroundColor: colors.primary,
    padding: 8,
    justifyContent: "center",
    height: 40,
  },
  searchBtnText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.regular,
    letterSpacing: 1,
  },
  productMain: {
    paddingHorizontal: 20,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginVertical: 10,
    height: 180,
    width: "100%",
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  productImage: {
    width: "38%",
    objectFit: "cover",
  },
  productInfo: {
    width: "58%",
    gap: 5,
    paddingVertical: 8,
  },
  productImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  productName: {
    fontSize: 14,
    fontFamily: fonts.regular,
    letterSpacing: 0.5,
    width: "90%",
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
  saleTag: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: colors.black,
    padding: 5,
  },
  saleTagText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fonts.regular,
    letterSpacing: 1,
  },
  loadMore: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    borderRadius: 50,
  },
});

export default Search;
