import React from 'react';
import { Modal, Portal } from 'react-native-paper';
import { View, Image, Platform, Pressable } from 'react-native';
import { styles } from './styles';
import Typography from '../Typography';
import { SvgXml } from 'react-native-svg';
import { images } from '../../constants/images';
import { fonts } from '../../constants/fonts';

const Toastify = ({ visible, type, textBody, buttonText, onDismiss }) => {
  const iconSource = type === 'SUCCESS'
    ? (Platform.OS === 'ios' ? images.complete_white : images.complete_white)
    : type === 'ERROR'
      ? images.error_white
      : (Platform.OS === 'ios' ? images.warning_white : images.warning_white);

  return (
    <Portal>
      <Modal
        visible={visible}
        contentContainerStyle={styles.containerStyle}
        dismissable={false}
      >
        <View>
          <View style={styles.imageOuter}>
            <SvgXml xml={iconSource} style={styles.imageContainer} />
          </View>
          <View style={{ marginVertical: 20 }}>
            <Typography
              title={textBody}
              size={20}
              textStyle={{
                fontFamily: fonts.bold,
                textAlign: 'center',
              }}
            />
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Pressable onPress={onDismiss} style={styles.SignInButton}>
              <Typography title={buttonText} textStyle={styles.SignInText} />
            </Pressable>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default Toastify;
