import { useUpdateProject, useViewProjects } from "@/services/projects.service";
import { responsiveSize } from "@/utils/reponsiveSize";
import { getDynamicTextStyle } from "@/utils/textResponsive";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Indicator from "./message-indicator";
import RenameModal from "./rename-project";

interface ScreenHeaderProps {
    title?: string
    subtitle?: string
    currentPage?: string
    editable?: boolean
    cover?: boolean
    id?: string
}

export default function ScreenHeader({ title, subtitle, currentPage, editable = true, cover = true, id }: ScreenHeaderProps) {
    const navigation = useNavigation();

    const [renameVisible, setRenameVisible] = useState(false);
    
    const { updateProject, isPending } = useUpdateProject()
    const { projects } = useViewProjects()

    const text = StyleSheet.create({
        head: {
            fontSize: responsiveSize(30),
            color: "white"
        },
        secondHead: {
            fontSize: responsiveSize(11),
            color: "#AEB7DA"
        }
    });

    return (
        <View style={cover ? header_two.container : { paddingBottom: 10, paddingHorizontal: 5 }}>
            <Pressable
                onPress={() => navigation.goBack()}
                style={cover ? {
                    paddingRight: 8,
                    paddingTop: 8,
                    paddingBottom: 8,
                    marginBottom: 20,
                } : {
                    paddingRight: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    marginBottom: 0,
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image style={{ height: 24, width: 24 }} source={require("../assets/images/chevron_backward.png")} />
                    <Text style={{
                        color: "#63D0FF",
                        fontSize: 14,
                    }}>
                        {currentPage}
                    </Text>
                </View>
            </Pressable>

            {cover ? (<View style={{ gap: 5 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Text style={[text.head, getDynamicTextStyle(title || "")]}>{title}</Text>
                    {editable && (
                        <TouchableOpacity onPress={()=>{
                            setRenameVisible(true)
                        }}>
                            <Feather name="edit-3" size={responsiveSize(28)} color="white" />
                        </TouchableOpacity>

                    )}
                    <RenameModal
                        visible={renameVisible}
                        initialValue={title}
                        onCancel={() => setRenameVisible(false)}
                        onConfirm={(newName) => {
                            if (newName.trim()) {
                                console.log(id)
                                updateProject({ id: parseInt(id!!), project_name: newName!! })
                            }
                            setRenameVisible(false)
                        }}
                        existingNames={projects?.map((p) => p.project_name)}
                    />
                    <Indicator message="Updating" isPending={isPending}/>
                </View>
                <Text style={[text.secondHead]}>{subtitle}</Text>
            </View>) : ("")}
        </View>
    )
}

const header_two = StyleSheet.create({
    container: {
        paddingBottom: 15,
        paddingHorizontal: 15,
    },
})