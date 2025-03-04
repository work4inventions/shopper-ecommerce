import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../authServices/axiosInstance";
import { ACCESS_TOKEN, API_URL } from "@/src/utils/commonUtils";

interface initialValType {
  isLoading: boolean;
  data: any | null;
  isError: boolean;
  errorMessage: string;
  hasNextPage: boolean,
  cursor: null,
  products:any
}

export const getProducts = createAsyncThunk(
  "getProducts",
  async (cursor: string | null) => {
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
   `;

    const variables = { cursor };

    try {
      let response = await AxiosInstance.post(
        `${API_URL}`,
        { query, variables },
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
        throw error.message || "An unexpected error occurred";
      }
    }
  }
);

const initialState: initialValType = {
  products: [],
  isLoading: false,
  isError: false,
  errorMessage: "",
  hasNextPage: true,
  cursor: null,
  data: null,
};

const getProductsSlice = createSlice({
  name: "getProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        const { edges, pageInfo } = action.payload;
        state.products = [...state.products, ...edges];
        state.hasNextPage = pageInfo.hasNextPage;
        state.cursor = pageInfo.endCursor;
        state.isLoading = false;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message || "Something went wrong";
      });
  },
});

export default getProductsSlice.reducer;
