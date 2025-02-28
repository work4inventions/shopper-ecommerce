import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Intro = () => {
  return (
    <View>
      <Text>Intro</Text>
            <Link href="login">Login</Link>
    </View>
  )
}

export default Intro