import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, Octicons } from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { FlatList } from "react-native-gesture-handler";
import { ACCESS_TOKEN, API_URL } from "@/src/utils/commonUtils";
import { filterData } from "../constants/data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/redux/store/store";
import { filterProducts } from "@/src/redux/slice/filterProdutSlice";
import { colors } from "../constants/colors";
import { fonts } from "../constants/fonts";
import Typography from "../common/Typography";

type FilterSection = {
  id: string;
  title: string;
  expanded: boolean;
  options?: FilterOption[];
  priceRange?: [number, number];
  minPrice?: number;
  maxPrice?: number;
};

export default function Filter(props) {
  const { isOpen, setIsOpen } = props;
  const [sections, setSections] = useState<FilterSection[]>(filterData);
  const dispatch = useDispatch();

  const getFilterProducts = useSelector(
    (state: RootState) => state.filterProducts
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
                checked: option.id === optionId ? !option.checked : false,
              })),
            }
          : section
      )
    );
  };

  const clearAll = () => {
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
        const selectedSort = section.options?.find(option => option.checked);
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
          .map((option) => option.id);
        if (selectedOptions.length > 0) {
          selectedFilters[section.id] = selectedOptions;
        }
      }
    });

    await fetchFilteredProducts(selectedFilters);
  };

  const fetchFilteredProducts = async (filters: any) => {
    let sortKey = "RELEVANCE";

    if (filters.sort) {
      switch (filters.sort) {
        case "featured":
          sortKey = "RELEVANCE";
          break;
        case "price-low-high":
          sortKey = "PRICE";
          break;
        case "price-high-low":
          sortKey = "PRICE_DESC";
          break;
      }
    }

    try {
      await dispatch(filterProducts({ 
        sortKey,
        filterQuery: [], 
        cursor: null 
      })).unwrap();

      setIsOpen(false);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Filter</Text>
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
                <Text style={styles.sectionTitle}>{section.title}</Text>
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
                        textStyle={{ fontFamily: fonts.regular }}
                        title={option.label}
                      ></Typography>
                    </TouchableOpacity>
                  )}
                />
              )}

              {section.id === "price" && section.expanded && (
                <View style={styles.priceRange}>
                  <Text>Price Range</Text>
                  <MultiSlider
                    values={section.priceRange || [0, 60]}
                    min={section.minPrice || 0}
                    max={section.maxPrice || 60}
                    onValuesChange={handlePriceChange}
                    sliderLength={250}
                    step={10}
                    customMarker={ () =>(<Octicons name='dot-fill' size={32}/>)}
                    allowOverlap={false}
                    snapped
                  />

                  <View style={styles.priceTextContainer}>
                    <Text>${section.priceRange?.[0]}</Text>
                    <Text>to</Text>
                    <Text>${section.priceRange?.[1]}</Text>
                  </View>
                </View>
              )}
            </View>
          )}
        />

        <View style={styles.footer}>
          <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
            <Ionicons name="trash-bin" size={20} color="black" />
            <Text>Clear all</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
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
    marginLeft:10,
  },
  optionCircle: {
    height: 24,
    width: 24,
    borderWidth: 1,
    borderColor: "#ccc",
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
    borderTopColor: "#ddd",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  applyButton: {
    backgroundColor: "black",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  applyButtonText: {
    color: "white",
    fontWeight: "500",
  },
});