import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../../authServices/axiosInstance";
import { ACCESS_TOKEN, API_URL } from "@/src/utils/commonUtils";

interface initialValType {
  isLoading: boolean;
  search: any[];
  isError: boolean;
  errorMessage: string;
  hasNextPage: boolean;
  cursor: string | null;
}

export const searchProducts = createAsyncThunk(
  "searchProducts",
  async ({
    searchTerm,
    cursor,
  }: {
    searchTerm: string;
    cursor: string | null;
  }) => {
    const query = `
    query SearchProducts($query: String!, $cursor: String) {
      products(query: $query, first: 20, after: $cursor) {
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
    }`;

    const variables = {
      query: `title:*${searchTerm}*`,
      cursor,
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
        edges: response.data.data.products.edges,
        pageInfo: response.data.data.products.pageInfo,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || "Unknown error"
      );
    }
  }
);

const initialState: initialValType = {
  isLoading: false,
  search: [],
  isError: false,
  errorMessage: "",
  hasNextPage: true,
  cursor: null,
};

const searchProductsSlice = createSlice({
  name: "searchProducts",
  initialState,
  reducers: {
    resetSearchProducts: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        const { edges, pageInfo } = action.payload;

        const uniqueProducts = Array.from(
          new Map(
            [...state.search, ...edges].map((item) => [item.node.id, item])
          ).values()
        );

        state.search = uniqueProducts;
        state.hasNextPage = pageInfo.hasNextPage;
        state.cursor = pageInfo.endCursor;
        state.isLoading = false;
      })

      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message || "Something went wrong";
      });
  },
});

export const { resetSearchProducts } = searchProductsSlice.actions;
export default searchProductsSlice.reducer;
