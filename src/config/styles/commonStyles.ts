import { colors } from "@/src/components/constants/colors";
import { fonts } from "@/src/components/constants/fonts";
import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingTop: 20 },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    marginBottom: 10,
    marginLeft: 15,
    marginTop:15
  },
});
