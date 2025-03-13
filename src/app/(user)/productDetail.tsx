import Typography from "@/src/components/common/Typography";
import { colors } from "@/src/components/constants/colors";
import { fonts } from "@/src/components/constants/fonts";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-snap-carousel";

export default function ProductDetail() {
  const { item } = useLocalSearchParams();
  const product = item ? JSON.parse(item) : null;
  const router = useRouter();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: "Check out this awesome content!",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleAddToCart = () => {
    console.log('Product added to cart:', product);
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <MaterialIcons
            name="arrow-back-ios"
            size={20}
            color={colors.black}
            style={{ marginLeft: 5 }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
          <AntDesign name="sharealt" size={20} color={colors.black} />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View>
          <Carousel
            data={product?.images?.edges || []}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                  setActiveIndex(index); 
                }}
              >
                <Image
                  source={{ uri: item.node.originalSrc }}
                  style={styles.carouselImage}
                />
              </TouchableOpacity>
            )}
            sliderWidth={350}
            itemWidth={300}
            loop
          />
        </View>
        
        {/* Product Info */}
        <View style={styles.productInfo}>
          <Typography title={product?.title} textStyle={styles.productName} />
          <View style={{ flexDirection: "row", gap: 10, marginVertical: 8 }}>
            <Typography
              title={`$ ${product?.priceRange?.minVariantPrice?.amount} `}
              textStyle={[
                styles.productPrice,
                { textDecorationLine: "line-through" },
              ]}
            />
            <Typography
              title={`$  ${product?.compareAtPriceRange?.minVariantPrice?.amount} `}
              textStyle={[
                styles.productPrice,
                { color: colors.colorTextSavings },
              ]}
            />
          </View>
          <Typography
            title={product.description}
            size={13}
            color={colors.gray}
          />
        </View>
        
        {/* Add to Cart Button */}
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Typography title="Add to Cart" textStyle={styles.addToCartText} />
        </TouchableOpacity>
      </ScrollView>

      {/* Full-Screen Image Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <Carousel
            data={product?.images?.edges || []}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item.node.originalSrc }}
                style={styles.fullscreenImage}
              />
            )}
            sliderWidth={450}
            itemWidth={400}
            loop
            firstItem={activeIndex - 3 }
            layout="stack"
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <MaterialIcons name="close" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
  },
  carouselImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    alignSelf: "center",
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  productInfo: { marginVertical: 20 },
  productName: { fontSize: 20, fontFamily: fonts.bold },
  productPrice: { fontSize: 14, color: colors.gray, fontFamily: fonts.regular },
  addToCartButton: {
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 15,
  },
  addToCartText: { color: colors.white, fontSize: 18, fontFamily: fonts.bold },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
    backgroundColor: colors.primaryLight,
  },
});
