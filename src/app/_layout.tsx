import { useFonts } from "expo-font";
import React, { useEffect } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { ToastProvider } from "../components/common/Toastify/ToastContext";
import { colors } from "../components/constants/colors";
import RootLayout from "../components/Layouts/RootLayout";
import store from "../redux/store/store";
import { fonts } from "../components/constants/fonts";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default () => {
  const [loaded, error] = useFonts({
    [fonts.regular]: require("../assets/fonts/futura light font.ttf"),
    [fonts.medium]: require("../assets/fonts/futura medium bt.ttf"),
    [fonts.bold]: require("../assets/fonts/futura bold font.ttf"),
    [fonts.semiBold]: require("../assets/fonts/futura heavy font.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const backgroundStyle = {
    flex: 1,
    backgroundColor: colors.white,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar backgroundColor={colors.black} barStyle={"dark-content"} />
      <Provider store={store}>
        <PaperProvider>
          <ToastProvider>
            <RootLayout />
          </ToastProvider>
        </PaperProvider>
      </Provider>
    </SafeAreaView>
  );
};
