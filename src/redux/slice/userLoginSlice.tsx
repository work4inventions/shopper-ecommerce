import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import AxiosInstance from '../../authServices/axiosInstance'
import { API_URL } from '@/src/utils/commonUtils';

interface initialValType {
  isLoading: boolean;
  data: any;
  isError: boolean;
  errorMessage: string;
}

export const userLogin: any = createAsyncThunk('login', async payload => {
  try {
    let response = await AxiosInstance.post(`${API_URL}/user/login`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data.message;
    } else {
      throw error;
    }
  }
});

export const dataValues: initialValType = {
  isLoading: false,
  data: null,
  isError: false,
  errorMessage: '',
};

const userLoginSlice = createSlice({
  name: 'login',
  initialState: dataValues,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(userLogin.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(userLogin.rejected, (state, action) => {
      state.isError = true;
      state.data = action.error.message;
      state.isLoading = true;
    });
  },
});

export default userLoginSlice.reducer;