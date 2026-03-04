import { responsiveSize } from "@/utils/reponsiveSize";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export default function AddActivityButton({ project_id }: { project_id: string }) {
    const router = useRouter()

    const [showOption, setShowOption] = useState<true | false>(false)

    const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center"
        },

        menuContainer: {
            backgroundColor: "#070C27",
            borderRadius: 20,
            padding: 25,
            borderWidth: 1,
            borderColor: "#625B71",
            justifyContent: "center",
            alignItems: "center",
        },
        options: {
            color: "white"
        },
        button: {
            borderRadius: 8,
            alignItems: "center",
            paddingVertical: 10,
            paddingHorizontal: 10,
            width: responsiveSize(200)
        },

    })

    return (
        <View>
            <Pressable
                onPress={() => {
                    setShowOption(true)
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
                            <Text style={{ color: "white", fontSize: 18 }}>Add New Activity</Text>
                            <Text style={{ color: "#AEB7DA", fontSize: 12 }}>Create New Activity</Text>
                        </View>
                    </View>
                </LinearGradient>
            </Pressable>
            <Modal
                animationType="none"
                transparent
                visible={showOption}
                onRequestClose={() => setShowOption(!showOption)}
            >
                <View style={styles.overlay}>
                    {/* Close when tapping outside */}
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={() => setShowOption(false)}
                    />
                    <View style={styles.menuContainer}>

                        <Pressable style={styles.button}
                            onPress={() => {
                                router.push({ pathname: "/(app)/dashboard/task/[project_id]/pert-calculate-form", params: { project_id: project_id } })
                                setShowOption(false)
                            }}
                        >
                            <LinearGradient
                                colors={["#63D0FF", "#427CE8", "#235691"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.button}
                            >
                                <Text style={styles.options}>PERT Estimate</Text>
                            </LinearGradient>
                        </Pressable>
                        <Pressable style={styles.button}
                            onPress={() => {
                                router.push({ pathname: "/(app)/dashboard/task/[project_id]/duration-form", params: { project_id: project_id } })
                                setShowOption(false)
                            }}
                        >
                            <LinearGradient
                                colors={["#63D0FF", "#427CE8", "#235691"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.button}
                            >
                                <Text style={styles.options}>Manual Duration</Text>
                            </LinearGradient>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    )
}