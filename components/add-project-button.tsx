import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Button, Dimensions, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AddProjectButton() {

    const [modalVisible, setModalVisible] = useState(false);
    const [projectName, setProjectName] = useState("");

    const queryClient = useQueryClient();

    const addNewProject = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser(); // user is an object

        const data_ = {
            project_name: projectName,
            user_id: user?.id
        }

        const { data: projects, error } = await supabase
            .from('projects')
            .insert([data_]) // wrap in array
            .select();

        if (error) {
            console.error('Failed to insert project:', error);
            return;
        }

        console.log('Inserted project:', projects);
    };

    const { mutate: addProject, isPending, isSuccess } = useMutation({
        mutationFn: addNewProject,
    })

    useEffect(() => {
        if (isSuccess) {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        }
    }, [isSuccess]);


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
                <TouchableOpacity
                    onPress={() => {
                        setModalVisible(false)
                    }}
                    style={menu.overlay}
                >
                    <View style={menu.menuContainer}>
                        <View
                            style={{
                                backgroundColor: "#070C27",
                                flex: 1
                            }}
                        >
                            <View style={forms.container}>
                                <Text style={{ color: "#AEB7DA" }}>Project Name</Text>
                                <TextInput
                                    onChangeText={setProjectName}
                                    value={projectName}
                                    placeholder="Name"
                                    style={forms.input}
                                    placeholderTextColor="#575884"
                                />
                                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 10 }}>
                                    <View style={{ minWidth: Dimensions.get("screen").width / 4.5 }}>
                                        <Button title="Add" onPress={() => {
                                            addProject()
                                            setModalVisible(false)
                                        }}
                                        />
                                    </View>
                                    <View style={{ minWidth: Dimensions.get("screen").width / 4.5 }}>
                                        <Button title="Cancel" onPress={() => setModalVisible(false)} />
                                    </View>

                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
            <TouchableOpacity
                onPress={() => {
                    // router.push("/(app)/forms"
                    setModalVisible(true)
                    setProjectName("") // clear input
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
                            <Text style={{ color: "#AEB7DA", fontSize: 12 }}>Create New Schedule</Text>
                        </View>
                    </View>
                </LinearGradient>
            </TouchableOpacity >
        </View>
    )
}

const menu = StyleSheet.create({
    overlay: {
        flex: 1,
        position: "relative",
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center", // pushes modal to bottom
        alignItems: "center"
    },

    menuContainer: {
        position: "absolute",
        maxHeight: 200,
        minWidth: "80%",
        backgroundColor: "#070C27",
        borderRadius: 20,
        padding: 30,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#427CE8"
    }
})

const forms = StyleSheet.create({
    container: {
        padding: 30,
        gap: 10
    },
    input: {
        color: "#AEB7DA",
        height: 40,
        padding: 10,
        maxWidth: 360,
        backgroundColor: "#252A4A",
        borderRadius: 10
    },
});