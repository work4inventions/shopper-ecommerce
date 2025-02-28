import { RootState } from "@/src/redux/store/store";
import React from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

const Categories = () => {
  const getCategoriesData = useSelector( (state: RootState) => state.getCategories);
  const categoryTitles = getCategoriesData?.data?.edges.map(item => item.node);
  
  const renderCategory = ({ item }) => (
    <Pressable style={styles.categoryItem} onPress={() => console.log(item.title)}>
      <Image source={{ uri: item.icon }} style={styles.categoryIcon} />
      <Text style={styles.categoryText}>{item.title === 'Home page' ? 'Trend' : item.title }</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={categoryTitles}
        renderItem={renderCategory}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 15,
  },
  categoryList: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
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
    textAlign: "center",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    color: "red",
  },
});

export default Categories;
