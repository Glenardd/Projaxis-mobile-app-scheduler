import { supabase } from '@/lib/supabase'
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'

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
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={handleLogin}
    />
  )
}
