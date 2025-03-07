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

export const filterProducts: any = createAsyncThunk(
  "filterProducts",
  async ({
    sortKey = "RELEVANCE",
    filterQuery = [],
    cursor = null,
  }: {
    sortKey?: string;
    filterQuery?: any[];
    cursor?: string | null;
  }) => {
    const query = `
      query($cursor: String) {
        products(first: 20, after: $cursor) {
          edges {
            node {
              id
              title
              description
              images(first: 1) {
                edges {
                  node {
                    originalSrc
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                }
              }
              compareAtPriceRange {
                minVariantPrice {
                  amount
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

    try {
      let response = await AxiosInstance.post(
        `${API_URL}`,
        {
          query,
          variables: { cursor },
        },
        {
          headers: {
            "X-Shopify-Storefront-Access-Token": `${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.data.products;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data.message;
      } else {
        throw error;
      }
    }
  }
);

// Initial state
const initialState: initialValType = {
  products: [],
  isLoading: false,
  isError: false,
  errorMessage: "",
  hasNextPage: true,
  cursor: null,
  data: null,
};

const filterProductsSlice = createSlice({
  name: "filterProducts",
  initialState,
  reducers: {
    resetFilters: (state) => {
      state.products = [];
      state.cursor = null;
      state.hasNextPage = true;
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
        if (!action.payload) return;
        const { edges, pageInfo } = action.payload;

        if (!state.cursor) {
          // First load or new filter
          state.products = edges || [];
        } else {
          // Loading more - append products
          state.products = [...state.products, ...(edges || [])];
        }

        state.hasNextPage = pageInfo?.hasNextPage || false;
        state.cursor = pageInfo?.endCursor || null;
        state.isLoading = false;
      })
      .addCase(filterProducts.rejected, (state, action) => {
        console.error("Reducer rejected:", action.error);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message || "Something went wrong";
      });
  },
});

export const { resetFilters } = filterProductsSlice.actions;

export default filterProductsSlice.reducer;
