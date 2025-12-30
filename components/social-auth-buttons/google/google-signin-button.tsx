import { supabase } from '@/lib/supabase';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default function GoogleLogin() {
  const router = useRouter()

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_AUTH_WEB_CLIENT_ID,
      offlineAccess: true,
      // forceCodeForRefreshToken:true,
    })
  }, [])

  const handleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const response = await GoogleSignin.signIn()

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.data?.idToken!,
      })

      if (error) {
        console.log('Supabase login error:', error)
        return
      }

      console.log('Logged in user:', data.user)

      // Navigate to home automatically after login
      router.replace("/(app)")
    } catch (error: any) {
      if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Login in progress...')
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated')
      } else {
        console.log('Google Signin error:', error)
      }
    }
  }

  return (
    <TouchableOpacity
      onPress={handleLogin}
      style={{
        borderRadius: 15,
        borderColor: "#4297E8",
        borderWidth: 2,
        overflow: "hidden"
      }}
    >
      <LinearGradient
        colors={["#63D0FF", "#427CE8", "#235691"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          justifyContent: "center",
          alignItems: "center",

          width: 190,
          height: 50,
        }}
      >
        <Text style={{ color: "white" }}>Sign in with Google</Text>
      </LinearGradient >
    </TouchableOpacity>
  )
}
