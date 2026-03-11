import LoadingIndicator from "@/components/loadingIndicator";
import { useSearchActivity } from "@/services/activity.service";
import { criticalPathMethod, type ActivityWithTiming } from "@/utils/cpm";
import { responsiveSize } from "@/utils/reponsiveSize";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";

export default function TaskContent() {
    const { project_id } = useLocalSearchParams<{ project_id: string }>()
    const { activity, isLoading, isRefetchingByUser, refetchByUser } = useSearchActivity(parseInt(project_id))

    const data: ActivityWithTiming[] = useMemo(() => {
        if (!activity) return [];
        return criticalPathMethod(activity) || [];
    }, [activity]);

    // sort data
    const sortedData = data?.sort((a, b) => {
        if (a.label.length !== b.label.length) {
            return a.label.length - b.label.length
        }
        return a.label.localeCompare(b.label)
    })

    // for logging
    // console.log(activity)

    const activity_container = ({ item }: { item: ActivityWithTiming }) => {

        const showPredecessors = item.predecessor.length !== 0 ? (item.predecessor.sort((a, b) => a.localeCompare(b)) + ','.slice(item.predecessor.length)) : "-"

        return (
            <View style={styles.container}>
                <View style={{ flexDirection: "row", gap: 10, justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                        <View>
                            <LinearGradient style={{ borderRadius: 10, height: 48, width: 51, alignItems: "center", justifyContent: "center" }} colors={["#63D0FF", "#427CE8", "#235691"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                                <Text style={{ fontSize: 30, color: "white" }}>{item.label}</Text>
                            </LinearGradient>
                        </View>
                        <View style={{ gap: 5 }}>
                            <Text style={{ color: "white", fontSize: 20 }}>{item.activity_name}</Text>
                            <Text style={styles.labels}>Activity {item.label}</Text>
                        </View>
                    </View>

                    {item.slack !== 0 ?
                        (<View style={{ backgroundColor: "#59A43E", padding: 5, borderRadius: 5 }}>
                            <Text style={{ color: "white", fontSize: responsiveSize(10) }}>Non-Critical</Text>
                        </View>) : (<View style={{ backgroundColor: "#D32254", padding: responsiveSize(5), borderRadius: 5 }}>
                            <Text style={{ color: "white", fontSize: responsiveSize(10) }}>Critical</Text>
                        </View>)}
                </View>
                <View style={styles.column}>
                    {/* row */}
                    <View style={{ gap: responsiveSize(10) }}>
                        <View style={styles.box}>
                            <Text style={styles.labels}>Predecessors</Text>
                            <Text style={styles.important}>{showPredecessors}</Text>
                        </View>
                        <View style={styles.box}>
                            <Text style={styles.labels}>Early Start</Text>
                            <Text style={styles.important}>{item.ES}</Text>
                        </View>
                        <View style={styles.box}>
                            <Text style={styles.labels}>Early Finish</Text>
                            <Text style={styles.important}>{item.EF}</Text>
                        </View>
                        <View style={styles.box}>
                            <Text style={styles.labels}>Float</Text>
                            <Text style={styles.important}>{item.slack}</Text>
                        </View>
                    </View>
                    {/* row */}
                    <View style={{ gap: 10 }}>
                        <View style={styles.box}>
                            <Text style={styles.labels}>Duration</Text>
                            <Text style={styles.important}>{item.expected}</Text>
                        </View>
                        <View style={styles.box}>
                            <Text style={styles.labels}>Latest Start</Text>
                            <Text style={styles.important}>{item.LS}</Text>
                        </View>
                        <View style={styles.box}>
                            <Text style={styles.labels}>Latest Finish</Text>
                            <Text style={styles.important}>{item.LF}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    };

    return isLoading ? <LoadingIndicator /> : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <FlatList
                data={sortedData}
                renderItem={activity_container}
                refreshControl={<RefreshControl refreshing={isRefetchingByUser} onRefresh={refetchByUser} />}
                keyExtractor={(item) => item ? item?.id.toString() : ""}
                ItemSeparatorComponent={() => <View style={{ height: responsiveSize(15) }} />}
                contentContainerStyle={{
                    padding: responsiveSize(25),
                    flexGrow: 1
                }}
                ListHeaderComponentStyle={{
                    marginBottom: 25
                }}
                ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "#30396cff", fontSize: responsiveSize(15) }}>Add activity first</Text>
                    </View>
                }
                style={{ width: "100%" }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 2,
        borderColor: 'rgba(98,91,113,0.28)',
        borderRadius: 15,
        backgroundColor: "#172038",
        padding: responsiveSize(20),
        overflow: "hidden",
        gap: responsiveSize(15),
    },
    important: {
        color: "white",
        fontSize: responsiveSize(15),
        fontWeight: "600"
    },
    box: {
        backgroundColor: "#070C27",
        height: responsiveSize(63),
        minWidth: "50%",
        justifyContent: "center",
        padding: responsiveSize(10),
        borderRadius: 10,
        gap: responsiveSize(10)
    },
    column: {
        justifyContent: "center",
        alignItems: "flex-start",
        gap: responsiveSize(12),
        flexDirection: "row"
    },
    labels: {
        color: "#AEB7DA",
        fontSize: responsiveSize(12)
    },
});
