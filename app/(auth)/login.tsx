import Indicator from '@/components/message-indicator';
import GoogleSignInButton from '@/components/social-auth-buttons/google/google-signin-button';
import { SplashScreenController } from '@/components/splash-screen-controller';
import { useAuthContext } from '@/hooks/use-auth-context';
import { Image } from "expo-image";
import { Redirect } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Login() {

  const { session, isLoading, isAuthenticating } = useAuthContext()

  if (isLoading) {
    return <SplashScreenController />
  }

  // if the user is already signed in, redirect them away from the login page
  if (session) {
    return <Redirect href="/" />
  }

  return (
    <View style={[styles.col, styles.bgc]}>
      <View style={styles.row}>
        <Image source={require("../../assets/images/projaxis.png")}
          style={{
            width: 80,
            height: 80,
          }}
          contentFit="contain"
        />
        <Text style={styles.title}>Projaxis</Text>
      </View>
      <GoogleSignInButton />
      <Indicator message='Please wait...' isPending={isAuthenticating} />
    </View>
  )
}

const styles = StyleSheet.create({
  col: {
    flex: 1,
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: 'center',
    gap: 5,
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
  },
  bgc: {
    backgroundColor: "#070C27",
  }
})