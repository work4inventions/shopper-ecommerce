import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { filterProducts } from "@/src/redux/slice/filterProdutSlice";
import { RootState } from "@/src/redux/store/store";
import Loader from "@/src/components/common/Loader";
import Typography from "@/src/components/common/Typography";
import { colors } from "@/src/components/constants/colors";
import { fonts } from "@/src/components/constants/fonts";
import { commonStyles } from "@/src/config/styles/commonStyles";
import Filter from "@/src/components/collection/filter";

const Collections = ({ route }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { products, isLoading, error, hasNextPage, cursor } = useSelector(
    (state: RootState) => state.filterProducts
  );

  useEffect(() => {
    // Load initial products
    dispatch(filterProducts({
      sortKey: "RELEVANCE",
      filterQuery: [],
      cursor: null
    }));
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && cursor) {
      dispatch(filterProducts({ 
        sortKey: "RELEVANCE", 
        filterQuery: [], 
        cursor 
      }));
    }
  }, [dispatch, hasNextPage, cursor]);

  const renderProduct = useCallback(({ item, index }) => {
    const imageUrl = item.node?.images?.edges?.[0]?.node?.originalSrc;
    const price = item.node?.priceRange?.minVariantPrice?.amount;
    const compareAtPrice = item.node?.compareAtPriceRange?.minVariantPrice?.amount;

    return (
      <View 
        key={`product-${item.node.id}-${index}`} 
        style={styles.productCard}
      >
        {imageUrl && <Image 
          source={{ uri: imageUrl }} 
          style={styles.productImage}
          resizeMode="cover"
        />}
        <Text style={styles.productName}>{item.node.title}</Text>
        <View style={{ flexDirection: "row", gap: 10, marginVertical: 8 }}>
          {compareAtPrice && (
            <Text style={[styles.productPrice, { textDecorationLine: "line-through" }]}>
              ${compareAtPrice}
            </Text>
          )}
          <Text style={[styles.productPrice, { color: colors.colorTextSavings }]}>
            ${price}
          </Text>
        </View>
        {compareAtPrice && (
          <View style={styles.saleTag}>
            <Text style={styles.saleTagText}>Sale</Text>
          </View>
        )}
      </View>
    );
  }, []);

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
          <Pressable onPress={handleLoadMore} style={styles.loadMore}>
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
  }, [isLoading, hasNextPage, handleLoadMore]);

  const keyExtractor = useCallback((item: any, index: number) => {
    return `product-${item.node.id}-${index}`;
  }, []);

  if (isLoading && !products.length) {
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
        <Pressable onPress={() => dispatch(filterProducts())}>
          <Text style={styles.retryButton}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <Typography title="Products" textStyle={commonStyles.sectionTitle} />
        <Pressable onPress={() => setIsOpen(!isOpen)} style={styles.filterBtn}>
          <AntDesign name="filter" size={24} color={colors.primaryLight} />
        </Pressable>
      </View>
      {isOpen && <Filter isOpen={isOpen} setIsOpen={setIsOpen} />}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={keyExtractor}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.serviceList}
        ListFooterComponent={ListFooterComponent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        columnWrapperStyle={styles.columnWrapper}
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
  header: {
    width: "100%",
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  filterBtn: {
    backgroundColor: colors.primary,
    padding: 10,
  },
  serviceList: {
    gap: 20,
  },
  productCard: {
    flex: 0,
    width: '48%',
    marginVertical: 10,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
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
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
});

export default Collections;