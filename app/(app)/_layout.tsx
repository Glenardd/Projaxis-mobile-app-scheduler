import { SplashScreenController } from '@/components/splash-screen-controller';
import { useAuthContext } from '@/hooks/use-auth-context';
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, Stack } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

interface User {
  image_url: string; // the URI
}
// header contents
function LogoTitle({ image_url }:User) {
  return (
    <View style={header.row_lg}>
      <View style={[header.row_sm]}>
        <LinearGradient
          colors={["#63D0FF", "#427CE8", "#235691"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 55,
            height: 55,
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
        </LinearGradient>
        <View style={header.col}>
          <Text style={text.head}>Projaxis</Text>
          <Text style={text.secondHead}>Project Library</Text>
        </View>
      </View>
      <Image source={{uri: image_url}} style={{height:50, width:50, borderRadius: 50}}/>
    </View>
  )
}

export default function HomeLayout() {
  const { session, isLoading } = useAuthContext()

  const avatar_url = session?.user.user_metadata?.avatar_url

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
        headerTitle: () => <LogoTitle image_url={avatar_url}/>,
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
  row_sm: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  row_lg: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 15,
    paddingHorizontal: 15,
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