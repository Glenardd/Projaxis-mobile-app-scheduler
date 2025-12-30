import { supabase } from '@/lib/supabase'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

export default function SignOutButton() {
  const router = useRouter()

  const onSignOutButtonPress = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error signing out:', error)
      return
    }

    router.replace('/')
  }

  return (
    <TouchableOpacity
      onPress={onSignOutButtonPress}
    >
      <LinearGradient
        colors={["#ff613eff", "#ea4d4dff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 120,
          height: 50,
          borderRadius: 25,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 15, fontWeight: "600" }}>Sign out</Text>
      </LinearGradient>
    </TouchableOpacity >
  )
}