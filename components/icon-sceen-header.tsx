import { responsiveSize } from "@/utils/reponsiveSize";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Dimensions, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import SignOutButton from "./social-auth-buttons/sign-out-button";

interface User {
  image_url: string
  username: string
}
// header contents
export default function LogoTitle({ image_url, username }: User) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={header.row_lg}>
      <View style={[header.row_sm]}>
        <LinearGradient
          colors={["#63D0FF", "#427CE8", "#235691"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: responsiveSize(55),
            height: responsiveSize(55),
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
            contentFit="contain"
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
          <Pressable
            style={menu.overlay}
            onPress={() => setModalVisible(false)}
          >
            <View style={menu.menuContainer}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Image source={{ uri: image_url }} style={{ height: responsiveSize(50), width: responsiveSize(50), borderRadius: 50 }} />
                <Text style={{ fontSize: 14, fontWeight: "600" }}>{username}</Text>
              </View>
              <SignOutButton />
            </View>
          </Pressable>
        </Modal>
      </View>
      <Pressable
        onPress={() => setModalVisible(true)}
      >
        <Image source={{ uri: image_url }} style={{ height: responsiveSize(50), width: responsiveSize(50), borderRadius: 50 }} />
      </Pressable>
    </View >
  )
}

//nav-header
const header = StyleSheet.create({
  row_sm: {
    flexDirection: "row",
    alignItems: "center",
    gap: responsiveSize(10)
  },
  row_lg: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: responsiveSize(15),
    paddingHorizontal: responsiveSize(15),
  },
  col: {
    flexDirection: "column",
    alignItems: "center",
  }
});


const text = StyleSheet.create({
  head: {
    fontSize: responsiveSize(30),
    color: "white"
  },
  secondHead: {
    fontSize: responsiveSize(15),
    color: "#AEB7DA"
  }
});

const menu = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end", 
  },

  menuContainer: {
    height: Dimensions.get("screen").height / 5,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: responsiveSize(30),
    paddingTop: responsiveSize(10),
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  text: {
    color: "black",
    fontSize: responsiveSize(18),
  },
});