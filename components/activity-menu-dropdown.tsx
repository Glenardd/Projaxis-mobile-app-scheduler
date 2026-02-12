import { useDeleteActivity } from "@/services/activity.service";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import DropdownMenu from "./menu-dropdown/dropdownMenu";
import MenuOption from "./menu-dropdown/menuOption";
import Indicator from "./message-indicator";

export default function ActivityMenuDropdown({ id, project_id, activity_id }: { id: number, project_id: string, activity_id: number }) {
    const [visible, setVisible] = useState(false);

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

                    router.push({
                        pathname:"/dashboard/task/[project_id]/[activity_id]",
                        params: {project_id: project_id,activity_id: activity_id}
                    })
                }}>
                    <Text>Edit</Text>
                </MenuOption>
                <MenuOption onSelect={() => {
                    setVisible(false)

                    deleteActivity(id)
                }}>
                    <Text>Delete</Text>
                </MenuOption>
            </DropdownMenu>
            <Indicator message="Deleting" isPending={isPending}/>
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
})