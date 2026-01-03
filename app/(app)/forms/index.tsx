import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function Forms() {

    const [activityName, setActivityName] = useState("");

    return (
        <View
            style={{
                backgroundColor: "#070C27",
                flex: 1
            }}
        >
            <View style={styles.container}>
                <Text style={{color:"#AEB7DA"}}>Activity Name</Text>
                <TextInput
                    onChangeText={setActivityName}
                    value={activityName}
                    placeholder="Activity"
                    style={styles.input}
                    placeholderTextColor="#575884"
                />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container:{
        padding: 30,
        gap:10
    },
    input: {
        color:"#AEB7DA",
        height: 40,
        borderWidth: 1,
        padding: 10,
        width: 360,
        backgroundColor: "#252A4A",
        borderRadius: 10
    },
});