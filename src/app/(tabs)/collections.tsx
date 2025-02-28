import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList, Button, Image } from "react-native";
import axios from "axios";

const Collections = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [cursor, setCursor] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const apiUrl = "https://shopper-ecommerce.myshopify.com/api/2025-01/graphql.json";
    const accessToken = "4bd135aed7c24e3a73afe9667ab059fd";

    const query = `
      query($cursor: String) {
        products(first: 10, after: $cursor) {
          edges {
            node {
              id
              title
              handle
              images(first: 1) {
                edges {
                  node {
                    originalSrc
                  }
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    const variables = {
      cursor: cursor
    };

    setLoading(true);

    try {
      const response = await axios.post(
        apiUrl,
        { query, variables },
        {
          headers: {
            "X-Shopify-Storefront-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      const { edges, pageInfo } = response.data.data.products;
      setProducts((prevProducts) => [...prevProducts, ...edges]);
      setHasNextPage(pageInfo.hasNextPage);
      setCursor(pageInfo.endCursor);

      setLoading(false);
    } catch (error) {
      console.log("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };

  if (loading && products.length === 0) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
        <Button title="Retry" onPress={fetchData} />
      </View>
    );
  }

  return (
    <View style={{ padding: 10 }}>
      <Text>Shopify Products:</Text>
      <FlatList
        data={products}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.node.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, marginBottom: 10, borderWidth: 1, borderRadius: 5 }}>
            <Text>Id: {item.node.id}</Text>
            <Text>Title: {item.node.title}</Text>
            <Text>Handle: {item.node.handle}</Text>

            {/* Render product image */}
            {item.node.images.edges.length > 0 && (
              <View>
                <Text>Product Image:</Text>
                <Image
                  source={{ uri: item.node.images.edges[0].node.originalSrc }}
                  style={{ width: 200, height: 200, marginTop: 10 }}
                />
              </View>
            )}
          </View>
        )}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : hasNextPage ? (
            <Button title="Load More" onPress={fetchData} />
          ) : null
        }
      />
    </View>
  );
};

export default Collections;
