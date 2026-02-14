import CriticalPathFlow from "@/components/criticalPathFlow";
import { useSearchActivity } from "@/services/activity.service";
import { criticalPathMethod, type ActivityWithTiming } from "@/utils/cpm";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function ProjectSummaryContent() {
    const { project_id } = useLocalSearchParams<{ project_id: string }>()
    const { activity, isLoading, isRefetchingByUser, refetchByUser } = useSearchActivity(parseInt(project_id))

    const cpm: ActivityWithTiming[] = criticalPathMethod(activity || [])

    const duration = Math.abs(Math.max(...cpm.map(a => a.EF))) !== Infinity ? Math.max(...cpm.map(a => a.EF)) : 0
    const critical = cpm.filter((a => a.slack === 0)).length !== 0 ? cpm.filter((a => a.slack === 0)).length : 0
    const totalActivities = cpm.length !== 0 ? cpm.length : 0
    const criticalPath = cpm.filter(a => a.slack === 0);

    const { width } = Dimensions.get("screen")

    const calculateProgress = (
        screenWidth: number,
        max: number,
        current: number,
        sidePadding = 67
    ) => {
        const barWidth = screenWidth - sidePadding * 2;

        const progress = max === 0 ? 0 : current / max;
        const clamped = Math.min(Math.max(progress, 0), 1);

        return {
            current: current,
            width: barWidth * clamped,
            percent: Math.round(clamped * 100),
        };
    }

    const GenerateIcon = ({ type }: { type: string }) => {
        const icon = (progressType: string): [string, string, string] => {

            let color: [string, string, string]

            switch (progressType) {
                case "critical":
                    color = ["#EA4F9F", "#F34548", "#C40003"]
                    break
                case "completed":
                    color = ["#1BE37F", "#51BD2A", "#4EA197"]
                    break
                case "total":
                    color = ["#650CFF", "#8C30EF", "#C568CA"]
                    break
                default:
                    color = ["#63D0FF", "#427CE8", "#235691"]
            }

            return color
        }

        return (
            <View>
                <LinearGradient colors={icon(type)} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 15, borderRadius: 10 }}>
                    <Image source={require("../../../../../assets/images/calendar.png")} style={{ height: 30, width: 30 }} />
                </LinearGradient>
            </View>
        )
    }

    /* ---------------- duration progress ------------------*/
    const { width: durationProgress, percent: percentDuration, current: currentDuration } = calculateProgress(width, duration, duration)

    /* ---------------- critical progress ------------------*/
    const { width: criticalProgress, percent: percentCritical, current: currentCritical } = calculateProgress(width, critical, 1)

    /* ---------------- critical progress ------------------*/
    const { width: completedProgress, percent: percentCompleted, current: currentCompleted } = calculateProgress(width, totalActivities, 3)

    const styles = StyleSheet.create({
        container: {
            paddingLeft: 28,
            paddingRight: 28,
            flex: 1
        },
        label: {
            color: "white",
            fontSize: 12
        },
        secondaryLabel: {
            color: "#AEB7DA",
            fontSize: 12
        },
        value: {
            fontSize: 30,
            color: "white"
        },
        col: {
            flexDirection: "column",
            justifyContent: "center",
            gap: 2
        },
        row: {
            flexDirection: "row",
            gap: 10
        },
        borderBox: {
            width: width - 50,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: "#63D0FF",
            overflow: "hidden",
        },
        secondBox: {
            borderColor: "rgba(98,91,113,0.28)",
            width: width - 50,
            borderRadius: 10,
            borderWidth: 2,
            overflow: "hidden",
            backgroundColor: "#172038",
            padding: 25,
            gap: 5
        },
        mainBox: {
            padding: 25,
            gap: 5
        },
        progressDuration: {
            width: durationProgress,
            height: 7,
            backgroundColor: "#63D0FF",
            borderRadius: 10,
        },
        progressCritical: {
            width: criticalProgress,
            height: 7,
            backgroundColor: "#63D0FF",
            borderRadius: 10,
        },
        progressCompleted: {
            width: completedProgress,
            height: 7,
            backgroundColor: "#63D0FF",
            borderRadius: 10,
        }
    })

    return (
        <ScrollView contentContainerStyle={{ paddingVertical: 30, gap: 16 }} style={styles.container}>
            {/* Project duration */}
            <View style={styles.borderBox}>
                <LinearGradient style={styles.mainBox} colors={["#1E3E67", "#0E2C53"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                    <View style={styles.row}>
                        <GenerateIcon type="duration" />
                        <View style={styles.col}>
                            <Text style={styles.label}>Total Project Duration</Text>
                            <Text style={styles.value}>{duration} Days</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <LinearGradient colors={["#80D1D4", "#3492EA", "#425EEA"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.progressDuration} />
                        <Text style={[styles.label, { alignContent: "center" }]}>{percentDuration}%</Text>
                    </View>
                </LinearGradient>
            </View>
            {/* Total activities */}
            <View style={styles.secondBox}>
                <View style={styles.row}>
                    <GenerateIcon type="total" />
                    <View style={styles.col}>
                        <Text style={styles.secondaryLabel}>Total Activities</Text>
                        <Text style={styles.value}>{totalActivities}</Text>
                    </View>
                </View>
            </View>
            {/*  critical activities */}
            <View style={styles.secondBox}>
                <View style={styles.row}>
                    <GenerateIcon type="critical" />
                    <View style={styles.col}>
                        <Text style={styles.secondaryLabel}>Critical Activities</Text>
                        <Text style={styles.value}>{critical === 0 ? ("0/0") : (currentCritical + "/" + critical)}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <LinearGradient colors={["#FF427E", "#F24B6F", "#FA0808"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.progressCritical} />
                    <Text style={[styles.secondaryLabel, { alignContent: "center" }]}>{percentCritical !== 0 && (percentCritical + "%")}</Text>
                </View>
            </View>
            {/* task completed */}
            <View style={styles.secondBox}>
                <View style={styles.row}>
                    <GenerateIcon type="completed" />
                    <View style={styles.col}>
                        <Text style={styles.secondaryLabel}>Task Completed</Text>
                        <Text style={styles.value}>{totalActivities === 0 ? ("0/0") : (currentCompleted + "/" + totalActivities)}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <LinearGradient colors={["#1BE37F", "#51BD2A", "#4EA197"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.progressCompleted} />
                    <Text style={[styles.secondaryLabel, { alignContent: "center" }]}>{percentCompleted !== 0 && (percentCompleted + "%")}</Text>
                </View>
            </View>
            {/* critical path */}
            <View style={styles.borderBox}>
                <LinearGradient style={styles.mainBox} colors={["#1E3E67", "#0E2C53"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                    <View style={styles.row}>
                        <GenerateIcon type="normal" />
                        <View style={styles.col}>
                            <Text style={{ fontSize: 30, color: "white" }}>Critical Path</Text>
                        </View>
                    </View>
                    <Text style={styles.secondaryLabel}>Activities with zero float that determine project duration</Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
                       <CriticalPathFlow criticalPath={criticalPath} orientation="horizontal" type="flow"/>
                    </View>
                </LinearGradient>
            </View>
        </ScrollView>
    )
}