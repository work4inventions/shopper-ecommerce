import {configureStore} from '@reduxjs/toolkit';
import userLoginSlice from '../slice/userLoginSlice';
import userRegisterSlice from '../slice/userRegisterSlice';
import userAuthenticateSlice from '../slice/userAuthenticateSlice';

const store = configureStore({
  reducer: {
    userLogin: userLoginSlice,
    userRegister: userRegisterSlice,
    getUserAuthenticate: userAuthenticateSlice,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
