import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Typography from '../Typography';
import { images } from '../../constants/images';
import { colors } from '../../constants/colors';

const Error = () => {
  return (
    <View>
      <View style={styles.container}>
        <Image
          src={images.data_empty}
          resizeMode="stretch"
          tintColor={colors.darkGray}
          style={styles.errorImg}
        />
        <Typography
          title={'No data available'}
          textStyle={{color: colors.gray}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorImg: {
    height: 100,
    width: 100,
  },
});

export default Error;
