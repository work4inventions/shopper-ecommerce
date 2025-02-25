import {StyleSheet} from 'react-native';
import { colors } from '../components/constants/colors';

export const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: colors.gray,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
  },
  imageOuter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 65,
    width: 65,
  },
  SignInButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 8,
    width: '100%', marginTop: 10,
},
SignInText: {
    color: colors.black,
    fontSize: 16,
    textTransform: 'capitalize',
    textAlign: 'center',
},
});
