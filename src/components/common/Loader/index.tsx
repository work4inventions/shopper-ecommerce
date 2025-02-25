/* eslint-disable prettier/prettier */
import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import { colors } from '../../constants/colors';

const Loader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.white} animating={true} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black,
  },
});
export default Loader;
