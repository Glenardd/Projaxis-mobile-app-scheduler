import ScreenHeader from "@/components/screen-header";
import SignOutButton from "@/components/social-auth-buttons/sign-out-button";
import { SplashScreenController } from '@/components/splash-screen-controller';
import { useAuthContext } from '@/hooks/use-auth-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from "expo-linear-gradient";
import { Redirect } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Home from ".";
import Forms from "./forms";

interface User {
  image_url: string
  username: string
}
// header contents
function LogoTitle({ image_url, username }: User) {
  const [modalVisible, setModalVisible] = useState(false);

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
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={menu.overlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={menu.menuContainer}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Image source={{ uri: image_url }} style={{ height: 50, width: 50, borderRadius: 50 }} />
                <Text style={{ fontSize: 14, fontWeight: "600" }}>{username}</Text>
              </View>
              <SignOutButton />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
      >
        <Image source={{ uri: image_url }} style={{ height: 50, width: 50, borderRadius: 50 }} />
      </TouchableOpacity>
    </View >
  )
}

export default function HomeLayout() {
  const { session, isLoading } = useAuthContext()
  const Stack = createNativeStackNavigator();

  const avatar_url = session?.user.user_metadata?.avatar_url
  const username = session?.user.user_metadata?.name

  if (isLoading) {
    <SplashScreenController />
  }

  if (!session) {
    return <Redirect href="/login" />
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={Home} options={{
        headerShown: true,
        headerTitle: () => <LogoTitle image_url={avatar_url} username={username} />,
        headerStyle: {
          backgroundColor: "#070C27"
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} />
      <Stack.Screen name="forms/index" component={Forms} options={{
        headerShown: true,
        headerShadowVisible: false,
        headerTitle: () => <ScreenHeader title="Add Activity" subtitle="Add new activity to the current project"/>,
        headerStyle: {
          backgroundColor: "#070C27"
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: () => null,
        headerBackVisible:false,
      }} />
    </Stack.Navigator>
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

const menu = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end", // pushes modal to bottom
  },

  menuContainer: {
    height: Dimensions.get("screen").height / 7,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 30,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  text: {
    color: "black",
    fontSize: 18,
  },
});
