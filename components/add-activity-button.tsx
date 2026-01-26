import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function AddActivityButton({project_id}:{project_id: string}) {
    const router = useRouter()
    return (
        <View>
            <Pressable
                onPress={() => router.push({pathname: "/(app)/dashboard/task/[project_id]/form", params: {project_id: project_id}})}
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
        </View>
    )
}