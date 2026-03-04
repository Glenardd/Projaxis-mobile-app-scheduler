import { useUpdateActivityStatus, type ActivityObjectType } from "@/services/activity.service"
import { type ActivityWithTiming } from "@/utils/cpm"
import { responsiveSize } from "@/utils/reponsiveSize"
import { shortenText } from "@/utils/textResponsive"
import Feather from "@expo/vector-icons/Feather"
import Octicons from '@expo/vector-icons/Octicons'
import { LinearGradient } from "expo-linear-gradient"
import { useState } from "react"
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import ActivityMenuDropdown from "./activity-menu-dropdown"
import ScheduleInfo from "./flowchart/schecduleInfo"
import Indicator from "./message-indicator"

export default function ActivityContainer({
    item,
    project_id,
    isComplete,
    cpm
}: {
    item: ActivityObjectType
    project_id: string
    isComplete?: boolean
    cpm: ActivityWithTiming[]
}) {

    const date = new Date(item.created_at)
    const [modalVisible, setModalVisible] = useState(false)

    const { updateStatus, isPending } = useUpdateActivityStatus()

    const nodeData = cpm?.find((node) => node.label === item.label);

    const showPredecessors =
        item.predecessor.length !== 0
            ? [...item.predecessor]
                .sort((a, b) => a.localeCompare(b))
                .join(", ")
            : "-"

    const formatted_date = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    })

    const styles = StyleSheet.create({
        important: {
            color: "#63D0FF",
            fontSize: responsiveSize(25)
        },
        labels: {
            color: "#AEB7DA",
            fontSize: responsiveSize(10)
        },
        box_lg: {
            backgroundColor: "#070C27",
            height: responsiveSize(80),
            width: responsiveSize(125),
            justifyContent: "center",
            padding: responsiveSize(10),
            borderRadius: 10,
            gap: responsiveSize(15),
            overflow: "hidden"
        }, box_sm: {
            backgroundColor: "#070C27",
            height: responsiveSize(83),
            width: responsiveSize(83),
            justifyContent: "center",
            padding: 8,
            borderRadius: 10,
            gap: 15,
        },
        container: {
            flex: 1,
            borderWidth: 2,
            borderColor: "rgba(98,91,113,0.28)",
            borderRadius: 15,
            backgroundColor: "#172038",
            padding: responsiveSize(28),
            overflow: "hidden",
            gap: responsiveSize(15)
        }
    })

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <LinearGradient
                        style={{
                            borderRadius: 10,
                            height: 48,
                            width: 51,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        colors={["#63D0FF", "#427CE8", "#235691"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={{ fontSize: 30, color: "white" }}>
                            {item.label}
                        </Text>
                    </LinearGradient>

                    <View style={{ gap: 5 }}>
                        <TouchableOpacity onPress={() => {
                            setModalVisible(true)
                        }}>
                            <Text
                                style={{ color: "white", fontSize: 20 }}
                                ellipsizeMode="tail"
                                numberOfLines={1}
                            >
                                {shortenText(item.activity_name, 8)}
                            </Text>
                        </TouchableOpacity>
                        <ScheduleInfo isVisible={modalVisible} onClose={() => setModalVisible(!modalVisible)} nodeData={nodeData} />
                        <Text
                            style={styles.labels}
                        >
                            Created in {formatted_date}
                        </Text>
                    </View>
                </View>

                <View style={{ position: "absolute", right: 40, top: 0 }}>
                    <ActivityMenuDropdown
                        id={item.id}
                        project_id={project_id}
                        activity_id={item.id}
                    />
                </View>

                {
                    isComplete ? (
                        <>
                            <TouchableOpacity
                                style={{ position: "absolute", right: 0, top: 0 }}
                                onPress={() => { updateStatus({ id: item.id, isDone: true }) }}
                            >
                                <Feather name="check-square" size={responsiveSize(24)} color="white" />
                            </TouchableOpacity>
                            <Indicator message="Adding Task" isPending={isPending} />
                        </>
                    ) : (
                        <>
                            <Pressable
                                style={{ position: "absolute", right: 0, top: 0 }}
                                onPress={() => { updateStatus({ id: item.id, isDone: false }) }}
                            >
                                <Octicons name="diff-removed" size={responsiveSize(24)} color="white" />
                            </Pressable>
                            <Indicator message="Removing Task" isPending={isPending} />
                        </>
                    )
                }
            </View>

            <View
                style={{
                    flexDirection: "row",
                    gap: 20,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <View style={styles.box_lg}>
                    <Text style={styles.labels}>Time</Text>
                    <Text style={styles.important}>
                        {(item.expected ?? 0) + "d"}
                    </Text>
                </View>

                <View style={styles.box_lg}>
                    <Text style={styles.labels}>Predecessor</Text>

                    {/* if predecessors is many allow horizontal scroll */}
                    <View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ alignItems: "center" }}
                        >
                            <Text style={styles.important}>
                                {showPredecessors}
                            </Text>
                        </ScrollView>
                    </View>
                </View>
            </View>

            {/* pert values */}
            <View>
                <Text style={styles.labels}>{"PERT Estimates (days)"}</Text>
            </View>
            <View
                style={{
                    justifyContent: "center",
                }}
            >
                <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "center", gap: 10 }}>
                    <View style={styles.box_sm}>
                        <Text style={styles.labels}>Optimistic</Text>
                        <Text style={styles.important}>{item.optimistic ? `${item.optimistic}d` : "-"}</Text>
                    </View>
                    <View style={styles.box_sm}>
                        <Text style={styles.labels}>Most Likely</Text>
                        <Text style={styles.important}>{item.most_likely ? `${item.most_likely}d` : "-"}</Text>
                    </View>
                    <View style={styles.box_sm}>
                        <Text style={styles.labels}>Pessimistic</Text>
                        <Text style={styles.important}>{item.pessimistic ? `${item.pessimistic}d` : "-"}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}