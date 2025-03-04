import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../constants/colors";
import Typography from "../Typography";

const Empty = () => {
  return (
    <View>
      <View style={styles.container}>
          <MaterialIcons
          name="no-encryption"
          size={50}
          resizeMode="stretch"
          tintColor={colors.gray}
        />
        <Typography
          title={"No data available"}
          textStyle={{ color: colors.gray }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Empty;
