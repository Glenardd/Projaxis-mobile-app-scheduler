import { useDeleteActivity } from "@/services/activity.service";
import { responsiveSize } from "@/utils/reponsiveSize";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import ConfirmationModal from "./confirmDeleteMenu";
import DropdownMenu from "./menu-dropdown/dropdownMenu";
import MenuOption from "./menu-dropdown/menuOption";
import Indicator from "./message-indicator";

export default function ActivityMenuDropdown({ id, project_id, activity_id }: { id: number, project_id: string, activity_id: number }) {
    const [visible, setVisible] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [showOption, setShowOption] = useState<true | false>(false)

    const { deleteActivity, isPending } = useDeleteActivity(parseInt(project_id))

    const router = useRouter()

    return (
        <View>
            <DropdownMenu
                visible={visible}
                handleOpen={() => setVisible(true)}
                handleClose={() => setVisible(false)}
                trigger={
                    <View
                        style={{
                            borderWidth: 10, borderColor: 'rgba(98,91,113,0.28)',
                            borderRadius: 10
                        }}
                    >
                        <Image
                            style={{ height: 4, width: 20 }}
                            source={require("../assets/images/activity_icons/menu.png")}
                            contentFit="contain"
                        />
                    </View>
                }
            >
                <MenuOption onSelect={() => {
                    setVisible(false)
                    setShowOption(true)
                }}>
                    <Text>Edit</Text>
                </MenuOption>
                <MenuOption onSelect={() => {
                    setVisible(false)
                    setConfirmDelete(true)
                }}>
                    <Text>Delete</Text>
                </MenuOption>
            </DropdownMenu>
            <ConfirmationModal
                visible={confirmDelete}
                onCancel={() => setConfirmDelete(false)}
                onConfirm={() => {
                    deleteActivity(id)
                    setConfirmDelete(false);
                }}
            />
            <Indicator message="Deleting" isPending={isPending} />
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

                        {/* pert calcuate edit */}
                        <Pressable style={styles.button}
                            onPress={() => {
                                router.push({
                                    pathname: "/dashboard/task/[project_id]/[activity_id]/pert-calculate-update",
                                    params: { project_id: project_id, activity_id: activity_id }
                                })
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

                        {/* duration edit */}
                        <Pressable style={styles.button}
                            onPress={() => {
                                router.push({
                                    pathname: "/dashboard/task/[project_id]/[activity_id]/duration-update",
                                    params: { project_id, activity_id }
                                });
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

const styles = StyleSheet.create({
    savingText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },
    savingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center"
    }, menuContainer: {
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
