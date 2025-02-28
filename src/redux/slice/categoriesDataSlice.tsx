import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../../authServices/axiosInstance";
import { ACCESS_TOKEN, API_URL } from "@/src/utils/commonUtils";

interface initialValType {
  isLoading: boolean;
  data: any | null;
  isError: boolean;
  errorMessage: string;
}

export const categoriesData: any = createAsyncThunk(
  "categoriesData",
  async (id) => {
    const query = `
   query {
    collection(id: "gid://shopify/Collection/322389541002") {
     products(first: 20) {
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
            compareAtPriceRange{
            minVariantPrice{
            amount
            currencyCode
            }
            }
          priceRange{
          minVariantPrice{
            amount
            currencyCode
            }
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
      return response.data.data.collection.products.edges;
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

const categoriesDataSlice = createSlice({
  name: "categoriesData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(categoriesData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })

      .addCase(categoriesData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.isError = false;
      })

      .addCase(categoriesData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message || "Something went wrong";
      });
  },
});

export default categoriesDataSlice.reducer;
