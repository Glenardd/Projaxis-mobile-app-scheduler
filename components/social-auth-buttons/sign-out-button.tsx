import { supabase } from '@/lib/supabase'
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
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ea4d4dff",
        width: 110,
        height: 50,
        borderRadius: 45,
      }}
      onPress={onSignOutButtonPress}
    >
      <Text style={{ color: "white", fontSize:15 }}>Sign out</Text>
    </TouchableOpacity>
  )
}