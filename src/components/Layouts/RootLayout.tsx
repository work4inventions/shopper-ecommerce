import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default () => {
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        {/* <Stack.Screen name="(auth)" /> */}
      </Stack>
    </GestureHandlerRootView>
  );
};
