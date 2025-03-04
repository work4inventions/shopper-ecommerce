import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../../authServices/axiosInstance";
import { ACCESS_TOKEN, API_URL } from "@/src/utils/commonUtils";

interface initialValType {
  isLoading: boolean;
  data: any | null;
  isError: boolean;
  errorMessage: string;
}


export const getCategories: any = createAsyncThunk(
  "getCategories",
  async () => {
    const query = `
    query($cursor: String) {
      collections(first: 10, after: $cursor) {
        edges {
          node {
            id
            title
            handle
            image {
              originalSrc
            }
            products(first: 20, after: $cursor) {
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
      }
    }
    `;
    try {
      let response = await AxiosInstance.post(
        `${API_URL}`,
        { query },
        {
          headers: {
            "X-Shopify-Storefront-Access-Token": `${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data.collections;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data.message;
      } else {
        throw error;
      }
    }
  }
);

const initialState: initialValType = {
  isLoading: false,
  data: null,
  isError: false,
  errorMessage: "",
};

const getCategoriesSlice = createSlice({
  name: "getCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })

      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.isError = false;
      })

      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message || "Something went wrong";
      });
  },
});

export default getCategoriesSlice.reducer;
