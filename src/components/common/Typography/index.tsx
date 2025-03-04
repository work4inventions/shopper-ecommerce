import React from 'react';
import {StyleSheet, Text, TextStyle} from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

type typoProps = {
  textStyle?: TextStyle | TextStyle[];
  title?: string;
  size?: number;
  color?: string;
  numberOfLines?: number;
};

const Typography = (props: typoProps) => {
  const {textStyle, title, size = 18, color = '', numberOfLines} = props;
  const txtStyle = textStyles(size, color);

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[txtStyle.textContainer, textStyle]}>
      {title}
    </Text>
  );
};

const textStyles = (size: number, color: string) =>
  StyleSheet.create({
    textContainer: {
      fontSize: size ? size : 18,
      color: color ? color : colors.black,
      fontFamily: fonts.medium,
    },
  });

export default Typography;
