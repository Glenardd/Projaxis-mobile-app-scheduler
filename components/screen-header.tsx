import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
interface ScreenHeaderProps{
    title: string
    subtitle: string
    currentPage: string
    editable: boolean
};

export default function ScreenHeader({ title, subtitle, currentPage, editable=true} : ScreenHeaderProps) {
    const navigation = useNavigation();

    return (
        <View style={header_two.container}>
            <Pressable
                onPress={() => navigation.goBack()}
                style={{
                    paddingRight: 8,
                    paddingTop: 8,
                    paddingBottom: 8,
                    marginBottom: 20,
                }}
            >
                <View style={{ flexDirection: "row", alignItems:"center" }}>
                    <Image style={{ height: 24, width: 24 }} source={require("../assets/images/chevron_backward.png")} />
                    <Text style={{
                        color: "#63D0FF",
                        fontSize: 14,
                    }}>
                        {currentPage}
                    </Text>
                </View>
            </Pressable>
            <View>
                <View style={{flexWrap:"wrap", flexDirection:"row", alignItems:"center", gap: 10}}>
                    <Text style={text.head}>{title}</Text>
                    {editable && (<Image source={require("../assets/images/rename_text.png")} style={{height:28, width:28}}/>)}
                </View>
                <Text style={text.secondHead}>{subtitle}</Text>
            </View>
        </View>
    )
}

const header_two = StyleSheet.create({
    container: {
        paddingBottom: 15,
        paddingHorizontal: 15,
    },

})

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