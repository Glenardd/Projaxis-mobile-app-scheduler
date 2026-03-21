import LoadingIndicator from "@/components/loadingIndicator";
import { useSearchActivity } from "@/services/activity.service";
import { calculatePercentage } from "@/utils/activity_limiter";
import { criticalPathMethod, type ActivityWithTiming } from "@/utils/cpm";
import { responsiveSize } from "@/utils/reponsiveSize";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { useMemo } from "react";
import { Dimensions, FlatList, ImageSourcePropType, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";

const SW = Dimensions.get('screen').width

interface Item {
    id: number
    title: string
    sub_title: string
    color: [string, string, string]
    icon: ImageSourcePropType
    href: Href<any | string>
}

const data: Item[] = [
    {
        id: 1,
        title: "Create new Task",
        sub_title: "Input new task",
        color: ["#63D0FF", "#4297E8", "#235691"],
        icon: require("@/assets/images/dashboard_icons/task.png"),
        href: "/dashboard/task/[project_id]"
    },
    {
        id: 2,
        title: "Activity Table",
        sub_title: "View CPM calculations",
        color: ["#650CFF", "#8C30EF", "#C568CA"],
        icon: require("@/assets/images/dashboard_icons/activity_table.png"),
        href: "/dashboard/activity-table/[project_id]"
    },
    {
        id: 3,
        title: "View Results",
        sub_title: "Project Summary",
        color: ["#C568CA", "#EF30A3", "#D32254"],
        icon: require("@/assets/images/dashboard_icons/view_results.png"),
        href: "/dashboard/project-summary/[project_id]"
    },
    {
        id: 4,
        title: "PERT/CPM Diagrams",
        sub_title: "Network visualizations",
        color: ["#EA4F9F", "#F34548", "#C40003"],
        icon: require("@/assets/images/dashboard_icons/diagram.png"),
        href: "/dashboard/diagram/[project_id]"
    },
    {
        id: 5,
        title: "Presentation Mode",
        sub_title: "Slide deck view",
        color: ["#FF6932", "#D35731", "#EE3333"],
        icon: require("@/assets/images/dashboard_icons/presentation.png"),
        href: "/dashboard/presentation-mode/[project_id]"
    },
    {
        id: 6,
        title: "Task Completed",
        sub_title: "View completed task",
        color: ["#1BE37F", "#51BD2A", "#4EA197"],
        icon: require("@/assets/images/dashboard_icons/task_completed.png"),
        href: "/dashboard/task-complete"
    },
]

const CARD_GAP = responsiveSize(15)
const HORIZONTAL_PADDING = responsiveSize(15)
const CARD_WIDTH = (SW - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2

const styles = StyleSheet.create({
    card: {
        borderWidth: 2,
        borderColor: 'rgba(98,91,113,0.28)',
        borderRadius: 15,
        backgroundColor: "rgba(98,91,113,0.28)",
        width: CARD_WIDTH,
        aspectRatio: 0.85,
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: 15,
    },
    text_title: {
        color: "white",
        fontSize: responsiveSize(18),
        textAlign: "center",
    },
    text_sub: {
        color: "#AEB7DA",
        fontSize: responsiveSize(11),
        textAlign: "center"
    },
    icon_container: {
        padding: 5,
        borderRadius: 10
    },
    // header styles
    header_container: {
        borderWidth: 2,
        borderColor: 'rgba(98,91,113,0.28)',
        borderRadius: 10,
        backgroundColor: "#172038",
        minHeight: 80,
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        flex: 1,
    },
    header_digit: {
        color: "white",
        fontSize: responsiveSize(25)
    },
    header_title: {
        color: "#AEB7DA",
        fontSize: 12
    },
    qouta_container: {
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'rgba(98,91,113,0.28)',
        backgroundColor: 'rgba(98,91,113,0.28)',  // ✅ acts as border color
        width: SW - HORIZONTAL_PADDING * 2,
        height: responsiveSize(35),
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
})

const ScrollHeader = ({ currentActivities, duration, critical, allActivities }: { currentActivities: number, duration: number, critical: number, allActivities: number }) => {
    
    const { percent, color } = calculatePercentage(allActivities, 50)

    return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 15,
                justifyContent: "center",
                marginBottom: responsiveSize(15),
            }}>
                <View style={styles.header_container}>
                    <Text style={styles.header_title}>Activities</Text>
                    <Text style={styles.header_digit}>{currentActivities}</Text>
                </View>
                <View style={styles.header_container}>
                    <Text style={styles.header_title}>Duration</Text>
                    <Text style={styles.header_digit}>{duration}d</Text>
                </View>
                <View style={styles.header_container}>
                    <Text style={styles.header_title}>Critical</Text>
                    <Text style={styles.header_digit}>{critical}</Text>
                </View>
            </View>
            <View style={styles.qouta_container}>
                <View style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0, 
                    width:`${percent}%`,
                    backgroundColor: color,
                }} />
                <Text style={{ color: "white", fontSize: responsiveSize(10) }}>{allActivities}/50 task created</Text>
            </View>
        </View>
    )
}

export default function DashboardContent() {
    const { project_id } = useLocalSearchParams<{ project_id: string }>()
    const { activity, refetchByUser, isRefetchingByUser, isLoading } = useSearchActivity(parseInt(project_id))

    const cpm: ActivityWithTiming[] = useMemo(() => {
        if (!activity) return []
        return criticalPathMethod(activity) || []
    }, [activity])

    const duration = Math.abs(Math.max(...cpm.map(a => a.EF))) !== Infinity ? Math.max(...cpm.map(a => a.EF)) : 0
    const critical = cpm.filter(a => a.slack === 0).length
    const totalActivities = cpm.length

    const doneDuration = Math.max(...cpm.filter(a => a.isDone).map(a => a.EF), 0)
    const criticalActivityDone = cpm.filter(item => item.slack === 0 && item.isDone).length
    const allTaskDone = cpm.filter(item => item.isDone).length

    const currentDuration = Math.abs(doneDuration - duration)
    const currentActivityDone = Math.abs(allTaskDone - totalActivities)
    const allActivities = totalActivities
    const currentCriticalActivityDone = Math.abs(criticalActivityDone - critical)

    const renderItem = ({ item }: { item: Item }) => (
        <Pressable
            style={styles.card}
            onPress={() => router.push({
                pathname: item.href,
                params: { project_id }
            })}
        >
            <LinearGradient
                colors={item.color}
                style={styles.icon_container}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <Image source={item.icon} style={{ height: responsiveSize(50), width: responsiveSize(50) }} />
            </LinearGradient>
            <View style={{ gap: 5 }}>
                <Text style={styles.text_title}>{item.title}</Text>
                <Text style={styles.text_sub}>{item.sub_title}</Text>
            </View>
        </Pressable>
    )

    return isLoading ? <LoadingIndicator /> : (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={
                <ScrollHeader
                    currentActivities={currentActivityDone}
                    duration={currentDuration}
                    critical={currentCriticalActivityDone}
                    allActivities={allActivities}
                />
            }
            numColumns={2}
            columnWrapperStyle={{ gap: CARD_GAP, justifyContent: "center" }}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={isRefetchingByUser} onRefresh={refetchByUser} />}
            contentContainerStyle={{
                paddingHorizontal: HORIZONTAL_PADDING,
                gap: CARD_GAP,
            }}
        />
    )
}