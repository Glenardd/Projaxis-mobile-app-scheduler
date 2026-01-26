import { useInsertProject } from "@/services/projects.service";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Button, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Indicator from "./message-indicator";

export default function AddProjectButton() {

    const [modalVisible, setModalVisible] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [inputEmpty, setInputEmpty] = useState(false);

    const { updatedProject, isPending } = useInsertProject()// project mutate 

    return (
        <View>
            <Modal
                animationType="none"
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible)
                }}
                transparent
            >
                <View style={styles.overlay}>
                    <Pressable
                        onPress={() => {
                            setModalVisible(false)
                        }}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.menuContainer}>
                        <View style={styles.container}>
                            <Text style={{ color: "#AEB7DA" }}>Project Name</Text>
                            <TextInput
                                onChangeText={(text) => {
                                    setProjectName(text)

                                    if (text.length > 0) {
                                        setInputEmpty(false)
                                    }
                                }}
                                value={projectName}
                                placeholder="Name"
                                style={[styles.input, { borderColor: inputEmpty ? "red" : "#625B71", borderWidth: 1 }]}
                                placeholderTextColor={inputEmpty ? "red" : "#575884"}
                            />
                            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 10 }}>
                                <View style={styles.buttons}>
                                    <Button title="Add" onPress={() => {
                                        if (!projectName.trim()) { // check for empty or just spaces
                                            setInputEmpty(true)
                                            return;
                                        }

                                        updatedProject(projectName, {
                                            onSuccess: () => {
                                                setModalVisible(false)
                                                setProjectName("")
                                                setInputEmpty(false)
                                            }
                                        }) //invoke to mutate
                                    }
                                    }
                                    />
                                </View>
                                <View style={styles.buttons}>
                                    <Button title="Cancel" onPress={() => setModalVisible(false)} />
                                </View>

                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            <Indicator message="Saving" isPending={isPending} />
            <Pressable
                onPress={() => {
                    // router.push("/(app)/forms"
                    setModalVisible(true)
                    setProjectName("") // clear input
                    setInputEmpty(false)// clear warning
                }}
                style={{
                    borderColor: "#306C86",
                    borderWidth: 1,
                    borderRadius: 15,
                    borderStyle: "dashed",
                    overflow: "hidden"
                }}
            >
                <LinearGradient
                    colors={["#1E3E67", "#0E2C53"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}

                    style={{
                        height: 105,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 }}>
                        <LinearGradient
                            colors={["#63D0FF", "#427CE8", "#235691"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                            <Image style={{ height: 15, width: 15 }} source={require("../assets/images/add-icon.png")} />
                        </LinearGradient>
                        <View>
                            <Text style={{ color: "white", fontSize: 18 }}>Create New Schedule</Text>
                            <Text style={{ color: "#AEB7DA", fontSize: 12 }}>Create new project</Text>
                        </View>
                    </View>
                </LinearGradient>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center", // pushes modal to bottom
        alignItems: "center"
    },

    menuContainer: {
        minHeight: "auto",
        backgroundColor: "#070C27",
        borderRadius: 20,
        padding: 30,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#625B71"
    },

    container: {
        flexDirection: "column",
        gap: 10
    },

    input: {
        color: "#AEB7DA",
        height: 40,
        padding: 10,
        minWidth: "40%",
        backgroundColor: "#252A4A",
        borderRadius: 10,
    },
    buttons: {
        minWidth: "40%"
    }
})