import { ACCESS_TOKEN, API_URL } from "@/src/utils/commonUtils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../../authServices/axiosInstance";

interface initialValType {
  isLoading: boolean;
  data: any | null;
  isError: boolean;
  errorMessage: string;
  hasNextPage: boolean;
  cursor: string | null;
  products: any[];
}

export const categoriesData: any = createAsyncThunk(
  "categoriesData",
  async ({ id, cursor }: { id: string; cursor: string | null }) => {
    const query = `
      query($id: ID!, $cursor: String) {
        collection(id: $id) {
          products(first: 20, after: $cursor) {
            edges {
              node {
                id
                title
                handle
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
    const variables = { id, cursor };

    try {
      const response = await AxiosInstance.post(
        `${API_URL}`,
        { query, variables },
        {
          headers: {
            "X-Shopify-Storefront-Access-Token": `${ACCESS_TOKEN}`,
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
  products: [],
};

const categoriesDataSlice = createSlice({
  name: "categoriesData",
  initialState,
  reducers: {
    resetCategoriesData: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(categoriesData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })

      .addCase(categoriesData.fulfilled, (state, action) => {
        const { edges, pageInfo } = action.payload;
        state.products = [...state.products, ...edges];
        state.hasNextPage = pageInfo.hasNextPage;
        state.cursor = pageInfo.endCursor;
        state.isLoading = false;
      })

      .addCase(categoriesData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message || "Something went wrong";
      });
  },
});

export const { resetCategoriesData } = categoriesDataSlice.actions;

export default categoriesDataSlice.reducer;
