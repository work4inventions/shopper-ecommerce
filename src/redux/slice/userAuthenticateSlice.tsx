import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import AxiosInstance from '../../authServices/axiosInstance';
import { API_URL } from '@/src/utils/commonUtils';

interface initialValType {
  isLoading: boolean;
  data: any;
  isError: boolean;
  errorMessage: string;
}

export const userAuthenticate: any = createAsyncThunk(
  'authenticate',
  async payload => {
    try {
      let response = await AxiosInstance.get(
        `${API_URL}/user/authenticate`,
        {
          headers: { 'x-access-token': `${payload}` },
        },
      );

      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data.message;
      } else {
        throw error;
      }
    }
  },
);

export const dataValues: initialValType = {
  isLoading: false,
  data: null,
  isError: false,
  errorMessage: '',
};

const userAuthenticateSlice = createSlice({
  name: 'authenticate',
  initialState: dataValues,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(userAuthenticate.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(userAuthenticate.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(userAuthenticate.rejected, (state, action) => {
      state.isError = true;
      state.data = action.error.message;
      state.isLoading = true;
    });
  },
});

export default userAuthenticateSlice.reducer;
