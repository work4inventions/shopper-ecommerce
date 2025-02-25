import React from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { fonts } from '../../constants/fonts';
import { colors } from '../../constants/colors';


const CustomModal = ({
  isVisible,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showConfirmButton = true,
  showCancelButton = true,
  customStyles = {},
}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}>
      <KeyboardAwareScrollView
        style={[styles.container, customStyles.container]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.main}>
          <View style={[styles.modalBox, customStyles.modalBox]}>
            <View style={[styles.content, customStyles.content]}>
              {title && (
                <Text style={[styles.title, customStyles.title]}>{title}</Text>
              )}
              {children}
              <View style={[styles.btnContainer, customStyles.btnContainer]}>
                {showConfirmButton && (
                  <Pressable
                    onPress={onConfirm}
                    style={[styles.button, customStyles.confirmButton]}>
                    <Text
                      style={[
                        styles.buttonText,
                        customStyles.confirmButtonText,
                      ]}>
                      {confirmText}
                    </Text>
                  </Pressable>
                )}
                {showCancelButton && (
                  <Pressable
                    onPress={onClose}
                    style={[styles.button, customStyles.cancelButton]}>
                    <Text
                      style={[
                        styles.buttonText,
                        customStyles.cancelButtonText,
                      ]}>
                      {cancelText}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'},
  modalBox: {margin: 20, borderRadius: 10, overflow: 'hidden', width: '100%'},
  content: {backgroundColor: colors.darkGray, padding: 20, borderRadius: 10},
  main: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: colors.white,
    width: '48%',
  },
  buttonText: {
    color: colors.black,
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});

export default CustomModal;
