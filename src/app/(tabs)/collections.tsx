import Loader from "@/src/components/common/Loader";
import Typography from "@/src/components/common/Typography";
import { colors } from "@/src/components/constants/colors";
import { filterData } from "@/src/components/constants/data";
import { fonts } from "@/src/components/constants/fonts";
import { commonStyles } from "@/src/config/styles/commonStyles";
import {
  categoriesData,
  resetCategoriesData,
} from "@/src/redux/slice/categoriesDataSlice";
import {
  filterProducts,
  resetFilterProducts,
} from "@/src/redux/slice/filterproductsSlice";
import { RootState } from "@/src/redux/store/store";
import { getReverseValue, getSortKey } from "@/src/utils/commonUtils";
import {
  AntDesign,
  Ionicons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

type FilterSection = {
  id: string;
  title: string;
  expanded: boolean;
  options?: FilterOption[];
  priceRange?: [number, number];
  minPrice?: number;
  maxPrice?: number;
};

const Collections = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [filterValue, setFilterValue] = useState();
  const [sections, setSections] = useState<FilterSection[]>();
  const getCategoriesData = useSelector(
    (state: RootState) => state.getCategories
  );
  const {
    products,
    isLoading: isCategoriesLoading,
    hasNextPage: hasCategoriesNextPage,
    cursor: categoriesCursor,
  } = useSelector((state: RootState) => state.categoriesData);

  const {
    filter,
    isLoading: isFilterLoading,
    hasNextPage: hasFilterNextPage,
    cursor: filterCursor,
  } = useSelector((state: RootState) => state.filterProducts);
  const isLoading = isCategoriesLoading || isFilterLoading;
  const hasNextPage = hasCategoriesNextPage || hasFilterNextPage;

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        dispatch(resetCategoriesData());

        let selectedId = id;
        if (id) {
          await dispatch(categoriesData({ id, cursor: null }));
          setActiveCategoryId(id);
        } else {
          const categories =
            getCategoriesData?.data?.edges?.map((item) => item.node) || [];

          if (categories.length > 0) {
            selectedId = categories[0].id;
            await dispatch(categoriesData({ id: selectedId, cursor: null }));
            setActiveCategoryId(selectedId);
          }
        }
        const categories =
          getCategoriesData?.data?.edges?.map((item) => ({
            id: item.node.id,
            label: item.node.title,
            checked: item.node.id === selectedId,
          })) || [];

        const updatedFilterData = filterData?.map((filter) =>
          filter.id === "type" ? { ...filter, options: categories } : filter
        );

        setSections(updatedFilterData);
      };

      fetchData();
    }, [id, getCategoriesData, filterData])
  );

  const toggleSection = (sectionId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, expanded: !section.expanded }
          : section
      )
    );
  };

  const toggleOption = (sectionId: string, optionId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              options: section.options?.map((option) => ({
                ...option,
                checked: option.id === optionId,
              })),
            }
          : section
      )
    );
  };
  
  const clearAll = async () => {
    await dispatch(resetFilterProducts());
    await dispatch(resetCategoriesData());
    const categories = await getCategoriesData?.data?.edges?.map((item)=> item.node) || [];   
    setIsOpen(false)
    
    if (categories.length > 0) {
      await dispatch(categoriesData({ id: categories[0]?.id, cursor: null }));
      setActiveCategoryId(categories[0].id);
    } else {
      console.warn("No categories found.");
    }

    setSections(
      sections.map((section) => ({
        ...section,
        options: section.options?.map((option) => ({
          ...option,
          checked: false,
        })),
        priceRange:
          section.id === "price"
            ? [section.minPrice || 0, section.maxPrice || 60]
            : section.priceRange,
      }))
    );
  };

  const handlePriceChange = (values: number[]) => {
    setSections(
      sections.map((section) =>
        section.id === "price" ? { ...section, priceRange: values } : section
      )
    );
  };

  const applyFilters = async () => {
    const selectedFilters: any = {};

    sections.forEach((section) => {
      if (section.id === "sort") {
        const selectedSort = section.options?.find((option) => option.checked);
        if (selectedSort) {
          selectedFilters.sort = selectedSort.id;
        }
      } else if (section.id === "price" && section.priceRange) {
        selectedFilters.price = {
          min: section.priceRange[0],
          max: section.priceRange[1],
        };
      } else if (section.options) {
        const selectedOptions = section.options
          .filter((option) => option.checked)
          .map((option) => ({ id: option.id, label: option.label }));

        if (selectedOptions.length > 0) {
          setActiveCategoryId(selectedOptions[0].id);
          selectedFilters[section.id] = selectedOptions;
        }
      }
    });

    const sortKey = getSortKey(selectedFilters.sort);
    const reverse = getReverseValue(selectedFilters.sort);

    setFilterValue(selectedFilters);
    setIsOpen(false);
    dispatch(resetFilterProducts());
    dispatch(
      filterProducts({
        filter: { ...selectedFilters, sortKey, reverse },
        cursor: null,
      })
    );
  };

  const handleLoadMore = useCallback(() => {
    if (activeCategoryId) {
      if (hasCategoriesNextPage && categoriesCursor) {
        dispatch(
          categoriesData({ id: activeCategoryId, cursor: categoriesCursor })
        );
      } else if (hasFilterNextPage && filterCursor) {
        dispatch(filterProducts({ filter: filterValue, cursor: filterCursor }));
      }
    }
  }, [
    hasCategoriesNextPage,
    categoriesCursor,
    hasFilterNextPage,
    filterCursor,
    dispatch,
    activeCategoryId,
  ]);

  const renderProduct = useCallback(({ item, index }) => {
    const imageUrl = item.node?.images?.edges?.[0]?.node?.originalSrc;
    const price = item.node?.priceRange?.minVariantPrice?.amount;
    const compareAtPrice =
      item.node?.compareAtPriceRange?.minVariantPrice?.amount;

    return (
      <Pressable
        key={`product-${item.node.id}-${index}`}
        style={styles.productCard}
        onPress={() =>
          router.push({
            pathname: "/productDetail",
            params: { item: JSON.stringify(item.node) },
          })
        }
      >
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.productImage}
            resizeMode="cover"
          />
        )}
        <Typography textStyle={styles.productName} title={item.node.title} />
        <View style={{ flexDirection: "row", gap: 10, marginVertical: 8 }}>
          {compareAtPrice && (
            <Typography
              title={`$ ${compareAtPrice}`}
              textStyle={[
                styles.productPrice,
                { textDecorationLine: "line-through" },
              ]}
            />
          )}
          <Typography
            title={`$ ${price}`}
            textStyle={[
              styles.productPrice,
              { color: colors.colorTextSavings },
            ]}
          />
        </View>
        {compareAtPrice && (
          <View style={styles.saleTag}>
            <Typography title="Sale" textStyle={styles.saleTagText} />
          </View>
        )}
      </Pressable>
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

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <Typography title="Products" textStyle={commonStyles.sectionTitle} />
        <Pressable onPress={() => setIsOpen(!isOpen)} style={styles.filterBtn}>
          <AntDesign name="filter" size={24} color={colors.primaryLight} />
        </Pressable>
      </View>

      <FlatList
        data={getCategoriesData?.data?.edges}
        keyExtractor={(item) => item.node.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const isActive = activeCategoryId === item?.node?.id;
          return (
            <Pressable
              style={[
                styles.categoryItem,
                isActive && styles.activeCategoryItem,
              ]}
              onPress={async () => {                
                setActiveCategoryId(item?.node?.id);
                await dispatch(resetFilterProducts());
                await dispatch(resetCategoriesData());
                await dispatch(categoriesData({ id: item?.node?.id, cursor: null }));
              }}
            >
              <Image
                source={{ uri: item?.node?.image?.originalSrc }}
                style={styles.categoryIcon}
                resizeMode="cover"
              />
              <Typography
                textStyle={styles.categoryText}
                title={item.node.title}
              />
            </Pressable>
          );
        }}
      />

      {isOpen && (
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Typography
                title="Filter"
                textStyle={commonStyles.sectionTitle}
              />
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={sections}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ marginVertical: 15 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: section }) => (
                <View style={styles.section}>
                  <TouchableOpacity
                    onPress={() => toggleSection(section.id)}
                    style={styles.sectionHeader}
                  >
                    <Typography
                      title={section.title}
                      textStyle={styles.sectionTitle}
                      size={14}
                    />
                    <Ionicons
                      name={section.expanded ? "chevron-up" : "chevron-down"}
                      size={20}
                    />
                  </TouchableOpacity>

                  {section.expanded && section.options && (
                    <FlatList
                      data={section.options}
                      keyExtractor={(option) => option.id}
                      renderItem={({ item: option }) => (
                        <TouchableOpacity
                          key={option.id}
                          style={styles.option}
                          onPress={() => toggleOption(section.id, option.id)}
                        >
                          <View
                            style={[
                              styles.optionCircle,
                              option.checked && styles.checkedCircle,
                            ]}
                          >
                            {option.checked && (
                              <Ionicons
                                name="checkmark"
                                size={18}
                                color={colors.white}
                              />
                            )}
                          </View>
                          <Typography
                            textStyle={{
                              fontFamily: fonts.regular,
                              letterSpacing: 1,
                            }}
                            title={option.label}
                            size={14}
                          ></Typography>
                        </TouchableOpacity>
                      )}
                    />
                  )}

                  {section.id === "price" && section.expanded && (
                    <View style={styles.priceRange}>
                      <Typography title="Price Range" size={14} />
                      <MultiSlider
                        values={section.priceRange || [0, 60]}
                        min={section.minPrice || 0}
                        max={section.maxPrice || 60}
                        onValuesChange={handlePriceChange}
                        sliderLength={250}
                        step={10}
                        customMarker={() => (
                          <Octicons
                            name="dot-fill"
                            size={32}
                            color={colors.primary}
                          />
                        )}
                        allowOverlap={false}
                        snapped
                        selectedStyle={{
                          backgroundColor: colors.primaryLight,
                        }}
                        unselectedStyle={{
                          backgroundColor: colors.gray,
                        }}
                      />

                      <View style={styles.priceTextContainer}>
                        <Typography
                          title={`$ ${section.priceRange?.[0]}`}
                          size={14}
                        />
                        <Typography title="to" size={14} />
                        <Typography
                          title={`$ ${section.priceRange?.[1]}`}
                          size={14}
                        />
                      </View>
                    </View>
                  )}
                </View>
              )}
            />

            <View style={styles.footer}>
              <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
                <Ionicons name="trash-bin" size={20} color="black" />
                <Typography title="Clear all" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyFilters}
              >
                <Typography title="Apply" textStyle={styles.applyButtonText} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <FlatList
        data={filter && filter.length > 0 ? filter : products}
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
    width: "48%",
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
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  categoryItem: {
    flexDirection: "row",
    gap: 10,
    height: 40,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    marginHorizontal: 6,
    marginTop: 10,
    marginBottom: 20,
  },
  activeCategoryItem: {
    backgroundColor: colors.primaryLight,
  },
  categoryIcon: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: fonts.regular,
    textAlign: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "flex-end",
    zIndex: 999,
  },
  container: {
    width: "80%",
    backgroundColor: "white",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    height: "90%",
  },
  closeButton: {
    padding: 8,
  },
  sections: {
    flex: 1,
    padding: 8,
    marginBottom: 60,
  },
  section: {
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderColor: colors.borderColor,
    borderBottomWidth: 1,
    borderRadius: 8,
  },
  sectionTitle: {
    fontFamily: fonts.regular,
    letterSpacing: 4,
  },
  options: {
    paddingLeft: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    marginLeft: 10,
  },
  optionCircle: {
    height: 24,
    width: 24,
    borderWidth: 1,
    borderColor: colors.borderColor,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedCircle: {
    backgroundColor: colors.black,
  },
  priceRange: {
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  priceTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderColor,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  applyButton: {
    backgroundColor: colors.black,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  applyButtonText: { color: colors.white, fontFamily: fonts.regular },
});

export default Collections;
