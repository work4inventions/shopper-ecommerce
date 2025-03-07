import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { images } from "../../constants/images";
import Typography from "../Typography";
import { MaterialIcons } from "@expo/vector-icons";

type headerProps = {
  isShow?: boolean;
  title?: string;
};
const Header = (props: headerProps) => {
  const { isShow, title } = props;
  const router = useRouter();

  const handleBack = () => {
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      {isShow ? (
        <Pressable onPress={handleBack} style={styles.TitleContainer}>
          <MaterialIcons name="arrow-back" size={32} color={colors.black} />
          <Typography textStyle={styles.Title} title={title} />
        </Pressable>
      ) : (
        <Typography textStyle={styles.Title} title={title} />
      )}
      {/* <View style={styles.app_Icon}>
        <View style={styles.notificationWrapper}>
          <Pressable>
            <SvgXml xml={images.notification} style={styles.icon} />
          </Pressable>
        </View>
        <Pressable>
          <SvgXml xml={images.profile_icon} style={styles.icon} />
        </Pressable>
      </View> */}
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  TitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  Title: {
    fontSize: 18,
    color: colors.black,
    fontFamily: fonts.medium,
  },
  app_Icon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  icon: {
    width: 20,
    height: 20,
    objectFit: "contain",
  },
  notificationWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    borderRadius: 10,
    width: 15,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
  },
});
export default Header;
