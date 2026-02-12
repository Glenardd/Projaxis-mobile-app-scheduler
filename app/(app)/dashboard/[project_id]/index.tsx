import LoadingIndicator from "@/components/loadingIndicator";
import { useSearchActivity } from "@/services/activity.service";
import { criticalPathMethod, type ActivityWithTiming } from "@/utils/cpm";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { useEffect, useMemo } from "react";
import { FlatList, ImageSourcePropType, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";

interface Item {
    id: number
    title: string
    sub_title: string
    color: [string, string, string]
    icon: ImageSourcePropType
    href: Href<any | string>
}

// dashboard header 
const scrollHeader = (numActivities: number, duration: number, critical: number) => {
    const styles = StyleSheet.create({
        container: {
            borderWidth: 2,
            borderColor: 'rgba(98,91,113,0.28)',
            borderRadius: 10,
            backgroundColor: "#172038",
            minHeight: 80,
            minWidth: 110,
            justifyContent: "center",
            alignItems: "center",
            gap: 5
        },
        text_digit: {
            color: "white",
            fontSize: 25
        },
        text_title: {
            color: "#AEB7DA",
            fontSize: 12
        }
    })

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 15,
                justifyContent: "center",
                minHeight: 115,
                marginBottom: 10
            }}
        >
            <View style={styles.container}>
                <Text style={styles.text_title}>Activities</Text>
                <Text style={styles.text_digit}>{numActivities}</Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.text_title}>Duration</Text>
                <Text style={styles.text_digit}>{duration}d</Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.text_title}>Critical</Text>
                <Text style={styles.text_digit}>{critical}</Text>
            </View>
        </View>
    )
}

// main dashboard content
export default function DashboardContent() {
    // project id
    const { project_id } = useLocalSearchParams<{ project_id: string }>();

    //for logging
    useEffect(() => {
        if (project_id) {
            console.log("Project Id in dashboard: ", project_id)
        }
    }, [project_id])

    const { activity, refetchByUser, isRefetchingByUser, isLoading } = useSearchActivity(parseInt(project_id))

    const cpm: ActivityWithTiming[] = useMemo(() => {
        if (!activity) return [];
        return criticalPathMethod(activity) || [];
    }, [activity]);

    const duration = Math.abs(Math.max(...cpm.map(a => a.EF))) !== Infinity ? Math.max(...cpm.map(a => a.EF)) : 0
    const critical = cpm.filter((a => a.slack === 0)).length !== 0 ? cpm.filter((a => a.slack === 0)).length : 0
    const totalActivities = cpm.length !== 0 ? cpm.length : 0

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
            href: "/task"
        },
    ]

    const styles = StyleSheet.create({
        container: {
            borderWidth: 2,
            borderColor: 'rgba(98,91,113,0.28)',
            borderRadius: 15,
            backgroundColor: "rgba(98,91,113,0.28)",
            minHeight: 199,
            maxHeight: 199,
            maxWidth: 172,
            minWidth: 172,
            justifyContent: "space-evenly",
            alignItems: "center",
            gap: 5,
            padding: 15
        },
        text_title: {
            color: "white",
            fontSize: 20,
            textAlign: "center",
        },
        text_sub: {
            color: "#AEB7DA",
            fontSize: 12,
            textAlign: "center"
        },
        icon_container: {
            padding: 5,
            borderRadius: 10
        }
    })

    // renderer for flatlisst
    const navs = ({ item }: { item: Item }) => {

        const isDisabled = item.id === 6

        return (
            <View style={{ height: 215 }}>
                <Pressable
                    style={[styles.container, { opacity: isDisabled ? 0.5 : 1 }]}
                    onPress={() => router.push({
                        pathname: item.href,
                        params: { project_id: project_id }
                    })}
                    disabled={isDisabled}
                >
                    <LinearGradient
                        colors={item.color}
                        style={styles.icon_container}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                    >
                        <Image source={item.icon} style={{ height: 50, width: 50 }} />
                    </LinearGradient>
                    <View style={{ gap: 5 }}>
                        <Text style={styles.text_title}>{item.title}</Text>
                        <Text style={styles.text_sub}>{item.sub_title}</Text>
                    </View>
                </Pressable>
            </View>
        )
    }

    return isLoading ? <LoadingIndicator /> : (
        <View
            style={{
                gap: 15,
                padding: 5,
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <FlatList
                data={data}
                renderItem={navs}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={scrollHeader(totalActivities,duration,critical)}
                numColumns={2}
                columnWrapperStyle={{ gap: 15 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isRefetchingByUser} onRefresh={refetchByUser} />}
            />
        </View>
    )
}