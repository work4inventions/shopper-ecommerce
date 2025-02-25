import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet} from 'react-native';
import Typography from '../Typography';

const ButtonWithLoader = ({
  title,
  onPress,
  loading = false,
  buttonStyle,
  textStyle,
  bgColor = '#cccccc',
  disabled = false,
}) => {
const btnStyle = buttonStyles(bgColor);
  return (
    <Pressable
      onPress={loading || disabled ? null : onPress}
      style={[buttonStyle, loading || disabled ? btnStyle.disabled : null]}
      disabled={loading || disabled}>
      {loading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Typography title={title} textStyle={textStyle} />
      )}
    </Pressable>
  );
};
const buttonStyles = (bgColor: string) =>
StyleSheet.create({
  disabled: {
    backgroundColor: bgColor,
  },
});

export default ButtonWithLoader;
