import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { images } from '../constants/images';
import { colors } from '../constants/colors';

const Splash = () => {
  return (
    <View style={styles.container}>
      <Image src={images.splash_img} style={styles.splashImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,  
  },
  splashImage: {
    width: '100%',  
    height: '100%', 
    resizeMode: 'contain',  
  },
});

export default Splash;
