import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from 'expo-router'

const Login = () => {
  const navigation = useNavigation()
  return (
    <View>
      <Text>Login</Text>
      <TouchableOpacity onPress={() => {navigation.navigate('(tabs)')}}>
        <Text>Submit</Text>
        </TouchableOpacity>
    </View>
  )
}

export default Login