import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../../authServices/axiosInstance";
import {
  ACCESS_TOKEN,
  API_URL,
  getReverseValue,
  getSortKey,
} from "@/src/utils/commonUtils";

interface initialValType {
  isLoading: boolean;
  data: any | null;
  isError: boolean;
  errorMessage: string;
  hasNextPage: boolean;
  cursor: string | null;
  filter: any[];
}
export const filterProducts = createAsyncThunk(
  "filterProducts",
  async ({ filter, cursor }: { filter: any; cursor: string | null }) => {
    if (!filter.type?.[0]?.id) {
      throw new Error("Collection ID is required to filter products.");
    }

    const query = `
      query (
        $cursor: String, 
        $priceMin: Float, 
        $priceMax: Float, 
        $productType: String, 
        $id: ID!, 
        $sortKey: ProductCollectionSortKeys, 
        $reverse: Boolean
      ) {
        collection(id: $id) {
          id
          products(
            first: 20
            after: $cursor
            sortKey: $sortKey
            reverse: $reverse
            filters: { 
              productType: $productType, 
              price: { min: $priceMin, max: $priceMax } 
            }
          ) {
            edges {
              node {
                id
                title
                handle
                productType
                description
                images(first: 1) {
                  edges {
                    node {
                      originalSrc
                    }
                  }
                }
                compareAtPriceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
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
      }
    `;

    const variables = {
      cursor,
      priceMin: filter.price?.min,
      priceMax: filter.price?.max,
      id: filter.type?.[0]?.id,
      productType: filter.type?.[0]?.label,
      sortKey: filter.sortKey,
      reverse: filter.reverse,
    };

    try {
      const response = await AxiosInstance.post(
        `${API_URL}`,
        { query, variables },
        {
          headers: {
            "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
            "Content-Type": "application/json",
          },
        }
      );
      return {
        edges: response.data.data.collection.products.edges,
        pageInfo: response.data.data.collection.products.pageInfo,
      };
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || "Unknown error");
      } else {
        throw new Error(error.message || "Unknown error");
      }
    }
  }
);

const initialState: initialValType = {
  isLoading: false,
  data: null,
  isError: false,
  errorMessage: "",
  hasNextPage: true,
  cursor: null,
  filter: [],
};

const filterProductsSlice = createSlice({
  name: "filterProduts",
  initialState,
  reducers: {
    resetFilterProducts: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(filterProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })

      .addCase(filterProducts.fulfilled, (state, action) => {
        const { edges, pageInfo } = action.payload;
        state.filter = [...state.filter, ...edges];
        state.hasNextPage = pageInfo.hasNextPage;
        state.cursor = pageInfo.endCursor;
        state.isLoading = false;
      })

      .addCase(filterProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message || "Something went wrong";
      });
  },
});

export const { resetFilterProducts } = filterProductsSlice.actions;

export default filterProductsSlice.reducer;
