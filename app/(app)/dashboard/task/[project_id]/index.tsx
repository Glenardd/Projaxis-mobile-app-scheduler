import ActivityMenuDropdown from "@/components/activity-menu-dropdown";
import AddActivityButton from "@/components/add-activity-button";
import LoadingIndicator from "@/components/loadingIndicator";
import { useSearchActivity, type ActivityObjectType } from "@/services/activity.service";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { Dimensions, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

export default function TaskSearch() {

    const { project_id } = useLocalSearchParams<{ project_id: string }>()

    //searched activity
    const { activity: data, isRefetchingByUser, refetchByUser, isLoading} = useSearchActivity(parseInt(project_id))

    // sort data when changes happen
    const sortedData = data?.sort((a, b) => a.label.localeCompare(b.label))

    // container for activity or task
    const Activity_container = ({ item }: { item: ActivityObjectType }) => {
        //get date
        const date = new Date(item.created_at);

        //show predecessors
        const showPredecessors = item.predecessor.length !== 0 ? (item.predecessor.sort((a, b) => a.localeCompare(b)) + ','.slice(item.predecessor.length)) : "-"

        const activityId = item.id

        //formated data
        const formatted_date = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short", // "January"
            day: "numeric"
        });

        return (
            <View style={styles.container}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", gap: 10, position: "relative" }}>
                        <View>
                            <LinearGradient style={{ borderRadius: 10, height: 48, width: 51, alignItems: "center", justifyContent: "center" }} colors={["#63D0FF", "#427CE8", "#235691"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                                <Text style={{ fontSize: 30, color: "white" }}>{item.label}</Text>
                            </LinearGradient>
                        </View>
                        <View style={{ gap: 5 }}>
                            <Text style={{ color: "white", fontSize: 20 }}>{item.activity_name}</Text>
                            <Text style={styles.labels}>Created in {formatted_date.toLocaleString()}</Text>
                        </View>
                    </View>
                    <View style={{ position: "absolute", right: 0, top: 0 }}>
                        <ActivityMenuDropdown id={activityId} project_id={project_id} activity_id={activityId}/>
                    </View>
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
                        <Text style={styles.labels}>Expected Time</Text>
                        <Text style={styles.important}>{(item.expected ?? 0) + "d"}</Text>
                    </View>
                    <View style={styles.box_lg}>
                        <Text style={styles.labels}>Predecessor</Text>
                        <Text style={styles.important}>{showPredecessors}</Text>
                    </View>
                </View>
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
                            <Text style={styles.important}>{item.optimistic}d</Text>
                        </View>
                        <View style={styles.box_sm}>
                            <Text style={styles.labels}>Most Likely</Text>
                            <Text style={styles.important}>{item.most_likely}d</Text>
                        </View>
                        <View style={styles.box_sm}>
                            <Text style={styles.labels}>Pessimistic</Text>
                            <Text style={styles.important}>{item.pessimistic}d</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    return isLoading ? <LoadingIndicator /> : (
        <>
            <FlatList
                data={sortedData}
                renderItem={Activity_container}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={<AddActivityButton project_id={project_id} />}
                refreshControl={
                    <RefreshControl refreshing={isRefetchingByUser} onRefresh={refetchByUser} />
                }
                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                contentContainerStyle={{
                    padding: 25,
                    flexGrow: 1
                }}
                ListHeaderComponentStyle={{
                    marginBottom: 25
                }}
                ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "#30396cff", fontSize: 15}}>Empty</Text>
                    </View>
                }
            />
        </>
    )
}

const { width: Screen_width } = Dimensions.get("window")

const styles = StyleSheet.create({
    important: {
        color: "#63D0FF",
        fontSize: 25,
    },
    labels: {
        color: "#AEB7DA",
        fontSize: 12
    },
    box_lg: {
        backgroundColor: "#070C27",
        height: 80,
        width: Screen_width * 0.35,
        justifyContent: "center",
        padding: 10,
        borderRadius: 10,
        gap: 15
    },
    box_sm: {
        backgroundColor: "#070C27",
        height: 83,
        width: Screen_width * 0.23,
        justifyContent: "center",
        padding: 8,
        borderRadius: 10,
        gap: 15
    },
    container: {
        flex:1,
        borderWidth: 2,
        borderColor: 'rgba(98,91,113,0.28)',
        borderRadius: 15,
        backgroundColor: "#172038",
        padding: 28,
        overflow: "hidden",
        gap: 15
    }

})