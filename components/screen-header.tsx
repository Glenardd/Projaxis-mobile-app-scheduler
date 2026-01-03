import { useNavigation } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function ScreenHeader({title, subtitle }: ScreenHeaderProps)  {
    const navigation = useNavigation();

    return (
        <View style={{ justifyContent: "flex-start" }}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                    padding: 8,
                    marginBottom: 5,
                }}
            >
                <Text style={{
                    color: "#63D0FF",
                    fontSize: 14,
                }}>
                    Project Library
                </Text>
            </TouchableOpacity>
            <View style={header_two.container}>
                <Text style={text.head}>{title}</Text>
                <Text style={text.secondHead}>{subtitle}</Text>
            </View>
        </View>
    )
}

const header_two = StyleSheet.create({
    container: {
        paddingBottom: 15,
        paddingHorizontal: 15
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