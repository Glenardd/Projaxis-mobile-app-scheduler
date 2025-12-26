import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView
} from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor:"#070C27" }}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle:{
              backgroundColor:"#070C27"
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="home" options={{
            headerShadowVisible: false,//allow drop shadow from the header
            headerTitle: () => (
              <View style={header.left}>
                <View style={{
                  width: 55,
                  height: 55,
                  backgroundColor: "#3e7790ff",
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                  <Image
                    source={require("../assets/images/projaxis.png")}
                    style={{
                      width: 50,
                      height: 50,
                    }}
                    resizeMode="contain"
                  />
                </View>
                <View>
                  <Text style={text.head}>Projaxis</Text>
                  <Text style={text.secondHead}>Project Library</Text>
                </View>
              </View>
            )
          }} />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

//nav-header
const header = StyleSheet.create({
  left: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    gap: 10
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
