import axios from "axios";
import { Modal, Portal } from "react-native-paper";
import Typography from "../components/common/Typography";
import { styles } from "./styles";
import { Image, Pressable, View } from "react-native";
import { dataStore } from "../utils/commonUtils";
import { useNavigation } from "@react-navigation/native";
import { fonts } from "../components/constants/fonts";
import { colors } from "../components/constants/colors";
import { images } from "../components/constants/images";
import { SCREENS } from "../components/constants/routes";
import { SvgXml } from "react-native-svg";

const instance = axios.create();

let userNotExist = false;

let isModalOpen = false;

const handleCancel = async () => {
  const navigation = useNavigation();
  await dataStore("removeItem", "token");
  await dataStore("removeItem", "role");
  await dataStore("removeItem", "email");
  await dataStore("removeItem", "organization");
  navigation.navigate(SCREENS.LOGIN);
  isModalOpen = false;
};

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 403 && !isModalOpen) {
      if (error.response.data.message === "User does not exist.") {
        userNotExist = true;
      }
      isModalOpen = true;
      <Portal>
        <Modal
          visible={isModalOpen}
          contentContainerStyle={styles.containerStyle}
          dismissable={false}
        >
          <View>
            <View style={styles.imageOuter}>
              <SvgXml
                xml={userNotExist ? images.error_white : images.warning_white}
                style={styles.imageContainer}
              />
            </View>
            <View style={{ marginVertical: 30 }}>
              <Typography
                title={
                  userNotExist ? "User does not exist." : "Session expired !"
                }
                size={20}
                textStyle={{
                  fontFamily: fonts.bold,
                  textAlign: "center",
                  marginBottom: 10,
                }}
              />
              <Typography
                title={
                  "Your current session has expired, and you have been logged out. Please log in again to continue."
                }
                size={14}
                color={colors.black}
                textStyle={{ fontFamily: fonts.bold, textAlign: "center" }}
              />
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Pressable onPress={handleCancel} style={styles.SignInButton}>
                <Typography
                  title="Go Back to Login"
                  textStyle={styles.SignInText}
                />
              </Pressable>
            </View>
          </View>
        </Modal>
      </Portal>;
    }
    return Promise.reject(error);
  }
);

export default instance;
