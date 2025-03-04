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
    [fonts.regular]: require("../assets/fonts/FuturaLT_1.ttf"),
    [fonts.medium]: require("../assets/fonts/FuturaLT-Light.ttf"),
    [fonts.bold]: require("../assets/fonts/FuturaLT-Bold_1.ttf"),
    [fonts.italic]: require("../assets/fonts/FuturaLT-Italic.ttf"),
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
