import {configureStore} from '@reduxjs/toolkit';
import userLoginSlice from '../slice/userLoginSlice';
import userRegisterSlice from '../slice/userRegisterSlice';
import userAuthenticateSlice from '../slice/userAuthenticateSlice';
import getCategoriesSlice from '../slice/categoriesSlice'
import categoriesDataSlice from '../slice/categoriesDataSlice';
import getProductsSlice from '../slice/getProductSlice';

const store = configureStore({
  reducer: {
    userLogin: userLoginSlice,
    userRegister: userRegisterSlice,
    getUserAuthenticate: userAuthenticateSlice,
    getCategories:getCategoriesSlice,
    categoriesData:categoriesDataSlice,
    getProducts:getProductsSlice,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
