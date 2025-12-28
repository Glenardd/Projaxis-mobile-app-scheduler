import { SplashScreenController } from '@/components/splash-screen-controller'
import { useAuthContext } from '@/hooks/use-auth-context'
import { Redirect, Stack } from 'expo-router'
import { Image, StyleSheet, Text, View } from 'react-native'

// header contents
function LogoTitle() {
  return (
    <View style={header.row}>
      <View style={{
        width: 55,
        height: 55,
        backgroundColor: "#3e7790ff",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Image
          source={require("../../assets/images/projaxis.png")}
          style={{
            width: 50,
            height: 50,
          }}
          resizeMode="contain"
        />
      </View>
      <View style={header.col}>
        <Text style={text.head}>Projaxis</Text>
        <Text style={text.secondHead}>Project Library</Text>
      </View>
    </View>
  )
}

export default function HomeLayout() {
  const { session, isLoading } = useAuthContext()

  if (isLoading) {
    <SplashScreenController />
  }

  if (!session) {
    return <Redirect href="/login" />
  }

  // console.log(session);

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: () => <LogoTitle />,
        headerStyle: {
          backgroundColor: "#070C27"
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    />
  )
}

//nav-header
const header = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    gap: 10
  },
  col: {
    flexDirection: "column",
    alignItems: "center",
  }

});

//nav-header
const text = StyleSheet.create({
  head: {
    fontSize: 30,
    color: "white"
  },
  secondHead: {
    fontSize: 15,
    color: "#AEB7DA"
  }
});