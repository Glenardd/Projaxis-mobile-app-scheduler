import { useSearchActivity } from "@/services/activity.service";
import { useDeleteProject, useDuplicateProject, useUpdateProject, useViewProjects, type ProjectObjectType } from "@/services/projects.service";
import { ActivityWithTiming, criticalPathMethod } from "@/utils/cpm";
import { responsiveSize } from "@/utils/reponsiveSize";
import { shortenText } from "@/utils/textResponsive";
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ConfirmationModal from "./confirmDeleteMenu";
import Indicator from "./message-indicator";
import RenameModal from "./rename-project";

export default function ProjectCard({ item }: { item: ProjectObjectType }) {

    const project_id = item.id
    const { activity, isLoading, isRefetchingByUser, refetchByUser } = useSearchActivity(project_id)
    const [confirmDuplicate, setConfirmDuplicate] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [renameVisible, setRenameVisible] = useState(false);

    const cpm: ActivityWithTiming[] = useMemo(() => {
        if (!activity) return [];
        return criticalPathMethod(activity) || [];
    }, [activity]);

    const duration = Math.abs(Math.max(...cpm.map(a => a.EF))) !== Infinity ? Math.max(...cpm.map(a => a.EF)) : 0
    const critical = cpm.filter((a => a.slack === 0)).length !== 0 ? cpm.filter((a => a.slack === 0)).length : 0
    const totalActivities = cpm.length !== 0 ? cpm.length : 0

    const doneDuration = Math.max(...cpm.filter(a => a.isDone).map(a => a.EF), 0)
    const criticalActivityDone = cpm?.filter((item) => item.slack === 0 && item.isDone === true).length || 0
    const allTaskDone = cpm?.filter((item) => item.isDone === true).length || 0

    const currentDuration = Math.abs(doneDuration - duration)
    const currentActivityDone = Math.abs(allTaskDone - totalActivities)
    const currentCriticalActivityDone = Math.abs(criticalActivityDone - critical)

    const router = useRouter()

    const date = new Date(item.created_at)
    const formattedDate = date.toLocaleDateString()

    //update project name hook
    const { updateProject, isPending: isUpdatingName } = useUpdateProject()

    //duplicate project hook
    const { duplicate, isPending: isDuplicating } = useDuplicateProject();

    //delete copy hook
    const { deleteProject, isPending: isDeleting } = useDeleteProject()

    //all projects
    const {projects} = useViewProjects() 

    const Seperator = ({ children }: { children: React.ReactNode }) => {
        return (
            <View style={styles.seperator}>
                {children}
            </View>
        )
    }

    const Buttons = ({ children, onPress }: { children: React.ReactNode, onPress: () => void }) => {
        return (
            <Pressable
                style={styles.button}
                onPress={onPress}
            >
                {children}
            </Pressable>
        )
    }

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", gap: 10 }}>
                    
                    <LinearGradient colors={["#1E3E67", "#0E2C53"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderColor: "#63D0FF", borderWidth: 1, borderRadius: 10 }}>
                        <Image source={require("@/assets/images/projaxis.png")} style={{ height: responsiveSize(50), width: responsiveSize(50) }} />
                    </LinearGradient>

                    <View style={{ gap: 5 }}>
                        <TouchableOpacity
                            onPress={() => {
                                router.push({
                                    pathname: "/(app)/dashboard/[project_id]",
                                    params: { project_id: item.id }
                                })
                            }}
                        >
                            <Text
                                style={styles.title}
                                ellipsizeMode="tail"
                                numberOfLines={1}
                            >
                                {shortenText(item.project_name, 8)}
                            </Text>
                        </TouchableOpacity>
                        <Text style={[styles.subText]}>Created in {formattedDate}</Text>
                    </View>
                </View>
                <View style={{ position: "absolute", right: 5, top: 5 }}>
                    <TouchableOpacity onPress={() => {
                        setRenameVisible(true)
                    }}>
                        <Feather name="edit-3" size={responsiveSize(24)} color="white" />
                    </TouchableOpacity>
                    <RenameModal
                        visible={renameVisible}
                        initialValue={item.project_name}
                        onCancel={() => setRenameVisible(false)}
                        onConfirm={(newName) => {
                            if (newName.trim()) {
                                updateProject({
                                    id: project_id,
                                    project_name: newName
                                })
                            }
                            setRenameVisible(false)
                        }}
                        existingNames={projects?.map((p)=> p.project_name)}
                    />
                    <Indicator message="Updating" isPending={isUpdatingName} />
                </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", alignContent: "center", marginTop: 15, gap: 10 }}>
                <Seperator>
                    <Text style={styles.subText}>Activities</Text>
                    <Text style={styles.values}>{currentActivityDone}</Text>
                </Seperator>

                <Seperator>
                    <Text style={styles.subText}>Duration</Text>
                    <Text style={styles.values}>{currentDuration}d</Text>
                </Seperator>

                <Seperator>
                    <Text style={styles.subText}>Critical</Text>
                    <Text style={styles.values}>{currentCriticalActivityDone}</Text>
                </Seperator>
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
                <Buttons onPress={() => {
                    // console.log("duplicate: ", project_id)
                    setConfirmDuplicate(true)
                }}>
                    <Ionicons name="duplicate-outline" size={responsiveSize(24)} color="#AEB7DA" />
                    <Text style={styles.subText}>Duplicate</Text>
                </Buttons>
                <ConfirmationModal
                    title="Confirm Copy"
                    message="Create a duplicate?"
                    visible={confirmDuplicate}
                    onCancel={() => setConfirmDuplicate(false)}
                    onConfirm={() => {
                        duplicate(project_id)
                        setConfirmDuplicate(false);
                    }}
                />
                <Indicator message="Copying" isPending={isDuplicating} />
                <Buttons onPress={() => {
                    // console.log(project_id)
                    setConfirmDelete(true)
                }}>
                    <MaterialIcons name="delete-outline" size={responsiveSize(24)} color="#AEB7DA" />
                    <Text style={styles.subText}>Delete</Text>
                </Buttons>
                <ConfirmationModal
                    visible={confirmDelete}
                    onCancel={() => setConfirmDelete(false)}
                    onConfirm={() => {
                        deleteProject(project_id);
                        setRenameVisible(false);
                    }}
                />
                <Indicator message="Deleting" isPending={isDeleting} />
            </View>
        </View >
    )
}

//text color
const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 2,
        borderColor: "rgba(98,91,113,0.28)",
        borderRadius: 15,
        backgroundColor: "#172038",
        padding: responsiveSize(20),
        overflow: "hidden",
        gap: responsiveSize(5)
    },
    values: {
        color: "white",
        fontSize: responsiveSize(24)
    },
    subText: {
        color: "#AEB7DA",
        fontSize: responsiveSize(12)
    },
    title: {
        color: "white",
        fontSize: responsiveSize(17)
    },
    seperator: {
        backgroundColor: "#070C27",
        borderRadius: 10,
        paddingVertical: responsiveSize(5),
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    },
    button: {
        backgroundColor: "rgba(98,91,113,0.28)",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        padding: 5,
        borderRadius: 5,
        flexDirection: "row",
        gap: 2,
        flex: 1,
    }
})
