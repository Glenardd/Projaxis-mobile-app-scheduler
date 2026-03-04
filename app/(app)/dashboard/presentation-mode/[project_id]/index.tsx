import CriticalPathFlow from "@/components/criticalPathFlow";
import FlowChart from "@/components/flowchart/flowchart";
import { useSearchActivity } from "@/services/activity.service";
import { criticalPathMethod, type ActivityWithTiming } from "@/utils/cpm";
import { responsiveSize } from "@/utils/reponsiveSize";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { Fragment, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function PresentationContent() {

    const [slide, setSlide] = useState(0)

    const { project_id } = useLocalSearchParams<{ project_id: string }>()

    const { activity, isLoading, isRefetchingByUser, refetchByUser } = useSearchActivity(parseInt(project_id))

    const cpm: ActivityWithTiming[] = useMemo(() => {
        if (!activity) return [];
        return criticalPathMethod(activity) || [];
    }, [activity]);

    // const duration = Math.abs(Math.max(...cpm.map(a => a.EF))) !== Infinity ? Math.max(...cpm.map(a => a.EF)) : 0
    // const critical = cpm.filter((a => a.slack === 0)).length !== 0 ? cpm.filter((a => a.slack === 0)).length : 0
    // const totalActivities = cpm.length !== 0 ? cpm.length : 0
    const criticalPath = cpm.filter(a => a.slack === 0)

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: responsiveSize(28),
        },
        flowContainer: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
        },
        text: {
            fontSize: responsiveSize(12),
            fontWeight: "600",
            color: "white"
        }
    })

    // slides or content
    const content = [
        <Fragment>
            <FlowChart data={cpm} isLoading={isLoading} isRefetchingByUser={isRefetchingByUser} refetchByUser={refetchByUser} small={true} />
        </Fragment>,
        <Fragment>
            <Text style={styles.text}>Each node shows the activity duration in days.</Text>
            <View style={styles.flowContainer}>
                <CriticalPathFlow criticalPath={cpm} orientation="vertical" type="informative" />
            </View>
        </Fragment>,
        <Fragment>
            <Text style={styles.text}>Critical path to follow.</Text>
            <View style={styles.flowContainer}>
                <CriticalPathFlow criticalPath={criticalPath} orientation="vertical" type="flow" />
            </View>
        </Fragment>
    ]

    return (
        <View style={styles.container}>
            {content[slide]}

            {/* ------------------------- Controller -------------------------- */}

            {slide !== 0 && (<Pressable style={{ position: "absolute", bottom: 50, left: 40 }} onPress={() => {
                setSlide((prev) => Math.max(prev - 1, 0))
            }}>
                <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 10 }}>
                    <Image source={require("@/assets/images/arrow.png")} style={{ height: responsiveSize(35), width: responsiveSize(35), transform: [{ scaleX: -1 }] }} />
                    <Text style={styles.text}>Prev</Text>
                </View>
            </Pressable>)}

            {slide !== content.length - 1 && (<Pressable style={{ position: "absolute", bottom: 50, right: 40 }} onPress={() => {
                setSlide((prev) => Math.min(prev + 1, content.length - 1))
            }}>
                <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 10 }}>
                    <Text style={styles.text}>Next</Text>
                    <Image source={require("@/assets/images/arrow.png")} style={{ height: responsiveSize(35), width: responsiveSize(35), transform: [{ scaleX: 1 }] }} />
                </View>
            </Pressable>)}
        </View>
    )
}