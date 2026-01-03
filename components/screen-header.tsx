import { useNavigation } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ScreenHeaderProps = {
    title: string
    subtitle?: string
    currentPage?: string
};

export default function ScreenHeader({ title, subtitle, currentPage }: ScreenHeaderProps) {
    const navigation = useNavigation();

    return (
        <View style={header_two.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                    paddingRight: 8,
                    paddingTop: 8,
                    paddingBottom: 8,
                    marginBottom: 20,
                }}
            >
                <View style={{ flexDirection: "row", alignItems:"center" }}>
                    <Image source={require("../assets/images/chevron_backward.png")} />
                    <Text style={{
                        color: "#63D0FF",
                        fontSize: 14,
                    }}>
                        {currentPage}
                    </Text>
                </View>
            </TouchableOpacity>
            <View>
                <Text style={text.head}>{title}</Text>
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