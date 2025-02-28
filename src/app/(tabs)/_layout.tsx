import React from "react";
import { View, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { colors } from "@/src/components/constants/colors";
import Typography from "@/src/components/common/Typography";
import { MaterialIcons } from "@expo/vector-icons";
import { tabItems } from "@/src/components/constants/navigation";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          borderWidth: 1,
        },
      }}
    >
      {tabItems.map((item, index) => (
        <Tabs.Screen
          key={index}
          name={item.name}
          options={{
            tabBarStyle: {
              backgroundColor: colors.white,
              shadowColor: colors.black,
              shadowOffset: {
                width: 0,
                height: -2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              height: 50,
            },
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabItemContainer}>
                <MaterialIcons
                  size={28}
                  name={item.src}
                  color={focused ? colors.primery : colors.gray}
                />
                <Typography
                  title={item.title}
                  color={focused ? colors.primery : colors.black}
                  size={10}
                  textStyle={{ fontWeight: "bold" }}
                />
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconImg: {
    width: 20,
    height: 20,
  },
  tabItemContainer: {
    alignItems: "center",
    height: 40,
    width: 60,
    marginTop: 20,
  },
  tabText: {
    fontSize: 10,
  },
});
