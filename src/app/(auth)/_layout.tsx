import Loader from "@/src/components/common/Loader";
import { userAuthenticate } from "@/src/redux/slice/userAuthenticateSlice";
import {
  dataStore,
  getInitialScreen,
  isIntroShown,
} from "@/src/utils/commonUtils";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const AuthStack = () => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isIntroDisplayed, setIsIntroDisplayed] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await dataStore("getItem", "token");
        const storedRole = await dataStore("getItem", "role");
        const introShown = await isIntroShown();

        if (storedToken && storedRole) {
          setToken(storedToken);
          setRole(storedRole);

          const auth = dispatch(userAuthenticate(storedToken));

          if (auth.type === "authenticate/rejected") {
            await dataStore("removeItem", "token");
            await dataStore("removeItem", "role");
            await dataStore("removeItem", "selectedFlatIds");
            setIsIntroDisplayed(true);
          }
        }

        setIsIntroDisplayed(introShown);
      } catch (error) {
        console.error("Failed to load the token from AsyncStorage", error);
      } finally {
        setIsLoading(false);
      }
    };

    getToken();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  const initialScreen = token
    ? getInitialScreen(role)
    : isIntroDisplayed
    ? "Login"
    : "intro";

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="intro" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
};

export default AuthStack;
