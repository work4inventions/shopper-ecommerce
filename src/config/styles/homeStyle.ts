import { colors } from '@/src/components/constants/colors';
import {  StyleSheet } from 'react-native';

export const homeStyles = () =>
  StyleSheet.create({
    container : {
      flex: 1,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    }
  });
