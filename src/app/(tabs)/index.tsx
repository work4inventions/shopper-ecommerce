import Typography from "@/src/components/common/Typography";
import Categories from "@/src/components/Home/Category";
import CategoryCard from "@/src/components/Home/CategoryCard";
import Product from "@/src/components/Home/Product";
import Saying from "@/src/components/Home/Saying";
import MyCarousel from "@/src/components/Home/Slider";
import { commonStyles } from "@/src/config/styles/commonStyles";
import { getCategories } from "@/src/redux/slice/categoriesSlice";
import { RootState } from "@/src/redux/store/store";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const [TrendingProduct, setTrendingProduct] = useState([]);
  const [NewArrivals, setNewArrivals] = useState([]);
  const getCategoriesData = useSelector(
    (state: RootState) => state.getCategories
  );
  const categorys = getCategoriesData?.data?.edges.map((item) => item.node);

  useEffect(() => {
    const trendingData = async () => {
      const response = await dispatch(getCategories());
      const trending = await response?.payload?.edges?.find((item) => item.node.title === "Trending");
      if (trending) {              
        setTrendingProduct(trending?.node?.products);
      }
      const newArrivals = await response?.payload?.edges?.find(
        (item) => item.node.title === "New Arrivals"
      );
      if (newArrivals) {
        setNewArrivals(newArrivals?.node?.products);
      }
    };
    trendingData();
  }, []);

  return (
    <ScrollView
      style={commonStyles.container}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
    >
      <MyCarousel />

      {/* Categories */}
      <Categories />

      {/* Products Grid */}
      <Typography title="Trending Now" textStyle={commonStyles.sectionTitle} />
      <Product getCategorieData={TrendingProduct} />

      <CategoryCard />

      <Saying />
      <Typography title="New Arrivals" textStyle={commonStyles.sectionTitle} />
      <Product getCategorieData={NewArrivals} />
    </ScrollView>
  );
};

export default HomeScreen;
