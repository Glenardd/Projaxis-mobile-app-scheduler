import Indicator from "@/components/message-indicator";
import { useActivityById, useSearchActivity, useUpdateActivity } from "@/services/activity.service";
import { pert } from "@/utils/pert";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";

interface PredecessorsTypes {
    label: string,
    value: string
}

export default function ActivityEditLayout() {

    const router = useRouter()

    const { activity_id } = useLocalSearchParams<{ activity_id: string }>()
    const { project_id } = useLocalSearchParams<{ project_id: string }>()

    const { isPending, isSuccess, updateActivityMutate } = useUpdateActivity(parseInt(activity_id))
    const { activity: activityById, refetchByUser: refetchByUserById, isRefetchingByUser: isRefetchingByUserById } = useActivityById(parseInt(activity_id))
    const { activity: searchedActivity, refetchByUser: refetchByUserSearch, isRefetchingByUser: isRefetchingByUserSearch } = useSearchActivity(parseInt(project_id))

    // values from db
    const activity_name_ = activityById?.activity_name;
    const optimistic_ = activityById?.optimistic;
    const most_likely = activityById?.most_likely;
    const pessimistic_ = activityById?.pessimistic;
    const projectId_ = activityById?.project_id;
    const activity_id_ = activityById?.id;
    const predecessor_ = activityById?.predecessor;

    const [isFocus, setIsFocus] = useState(false);

    const [predecessor, setPredecessor] = useState<string[]>([])
    const [activityName, setActivityName] = useState("")
    const [optimistic, setOptimistic] = useState("")
    const [mostLikely, setMostLikely] = useState("")
    const [pessimistic, setPessimistic] = useState("")

    const [inputEmpty_activityName, setInputEmpty_activityName] = useState(false)
    const [inputEmpty_optimistic, setInputEmpty_optimistic] = useState(false)
    const [inputEmpty_pessimistic, setInputEmpty_pessimistic] = useState(false)
    const [inputEmpty_mostLikey, setInputEmpty_mostLikely] = useState(false)
    const [inputEmpty_predecessor, setInputEmpty_predecessor] = useState(false)

    // find the activity from the predecessor
    const activity_predecessor = searchedActivity?.filter((item) => predecessor_?.includes(item.label))
    const predecessor_content = activity_predecessor?.map((item) => ({
        label: item.label,
        value: item.activity_name
    }))
    // console.log("Activity Predecessor at [activity_id]/index", predecessor_content)

    const activityOptions = searchedActivity
        ? searchedActivity
            .filter(item => item.id !== parseInt(activity_id))
            .map((item) => ({
                label: item.label,
                value: item.activity_name
            }))
        : [];

    // logging
    activityOptions.map((item) => console.log({ label: item.label, value: item.value }))

    // will check if it has predecessor available
    const isPredecessor = predecessor_?.map((item) => {
        return item ?? []
    }).length !== 0

    const expected_time = pert({ optimistic: optimistic, mostLikely: mostLikely, pessimistic: pessimistic })

    useEffect(() => {
        if (!activityById) return
        setActivityName(activity_name_ ?? "")
        setOptimistic(optimistic_ != null ? String(optimistic_) : "")
        setMostLikely(most_likely != null ? String(most_likely) : "")
        setPessimistic(pessimistic_ != null ? String(pessimistic_) : "")
        setPredecessor(predecessor_content ? predecessor_content.map(item => item.value) : [])

        if (!isPending && isSuccess) {
            router.back();
        }
    }, [activityById, isPending, isSuccess])

    const renderItem = ({ value, label }: PredecessorsTypes) => {
        return (
            <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                <Text style={[{ color: "#59accfff" }, styles.item]}>{label}</Text>
                <Text style={styles.item}>{value}</Text>
            </View>
        );
    };

    //for logging
    // useEffect(() => {
    //     console.log("activityName:", activityName)
    //     console.log("optimistic:", optimistic)
    //     console.log("mostLikely:", mostLikely)
    //     console.log("pessimistic:", pessimistic)
    //     console.log("predecessor:", predecessor)
    //     console.log("inputEmpty_activityName:", inputEmpty_activityName)
    // }, [
    //     activityName,
    //     optimistic,
    //     mostLikely,
    //     pessimistic,
    //     predecessor,
    //     inputEmpty_activityName,
    //     inputEmpty_optimistic,
    //     inputEmpty_pessimistic,
    //     inputEmpty_predecessor
    // ])

    return (
        <View style={styles.container}>
            <View style={styles.column}>
                <View style={styles.expected_time}>
                    <Text style={styles.label}>Expected Time</Text>
                    <Text style={{color: "white", fontSize: 50}}>{!expected_time ? 0 : expected_time}d</Text>
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Activity Name</Text>
                    <TextInput
                        placeholder="Name"
                        placeholderTextColor={styles.placeholder.color}
                        style={[styles.input, { borderColor: inputEmpty_activityName ? "red" : "#625B71", borderWidth: 1 }]}
                        value={activityName}
                        onChangeText={(text) => {
                            setActivityName(text)

                            if (text.length > 0) {
                                setInputEmpty_activityName(false)
                            }
                        }}
                    />
                </View>
                <View style={styles.fieldContainer}>
                    {isPredecessor && (
                        <>
                            <Text style={styles.label}>Predecessor</Text>
                            <MultiSelect
                                mode="auto"
                                style={[styles.input, { borderColor: inputEmpty_predecessor ? "red" : "#625B71", borderWidth: 1 }]}
                                data={activityOptions}
                                placeholderStyle={styles.placeholder}
                                labelField="label"
                                valueField="value"
                                placeholder={isFocus ? "..." : "Select"}
                                renderItem={renderItem}
                                value={predecessor}
                                onChange={(item) => {
                                    console.log("Items is: ", item)
                                    if (item === null) {
                                        setIsFocus(false)
                                        setInputEmpty_predecessor(true)

                                        return setPredecessor([])
                                    } else {
                                        setInputEmpty_predecessor(false)
                                        return setPredecessor(item)
                                    }
                                }}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                dropdownPosition="auto"
                                maxHeight={150}
                                inverted={false}

                                itemTextStyle={styles.itemText}
                                selectedTextStyle={styles.selectedText}
                                activeColor="#b8b8b8ff"
                                selectedStyle={styles.selectedItem}
                            />
                        </>
                    )}
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Optimistic Time</Text>
                    <TextInput
                        placeholder="Time"
                        placeholderTextColor={styles.placeholder.color}
                        style={[styles.input, { borderColor: inputEmpty_optimistic ? "red" : "#625B71", borderWidth: 1 }]}
                        value={optimistic}
                        onChangeText={(optimistic) => {
                            setOptimistic(optimistic)

                            if (optimistic.length > 0) {
                                setInputEmpty_optimistic(false)
                            } else {
                                setInputEmpty_optimistic(true)
                            }
                        }}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Most Likely Time</Text>
                    <TextInput
                        placeholder="Time"
                        placeholderTextColor={styles.placeholder.color}
                        style={[styles.input, { borderColor: inputEmpty_mostLikey ? "red" : "#625B71", borderWidth: 1 }]}
                        value={mostLikely}
                        onChangeText={(mostLikely) => {
                            setMostLikely(mostLikely)

                            if (mostLikely.length > 0) {
                                setInputEmpty_mostLikely(false)
                            }
                        }}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Pessimistic Time</Text>
                    <TextInput
                        placeholder="Time"
                        placeholderTextColor={styles.placeholder.color}
                        style={[styles.input, { borderColor: inputEmpty_pessimistic ? "red" : "#625B71", borderWidth: 1 }]}
                        value={pessimistic}
                        onChangeText={(pessimistic) => {
                            setPessimistic(pessimistic)

                            if (pessimistic.length > 0) {
                                setInputEmpty_pessimistic(false)
                            }
                        }}
                        keyboardType="numeric"
                    />
                </View>
                <View style={[styles.row, { justifyContent: "space-between", paddingTop: 10 }]}>
                    <View style={styles.buttons}>
                        <Pressable onPress={async () => {

                            // console.log("activity_name: ", inputEmpty_activityName)
                            // console.log("optimistic: ", inputEmpty_optimistic)
                            // console.log("most likely: ", inputEmpty_mostLikey)
                            // console.log("pessimistic: ", inputEmpty_pessimistic)
                            // console.log("predecessor: ", inputEmpty_predecessor)

                            let hasError = false

                            if (!activityName.trim()) {
                                setInputEmpty_activityName(true)
                                hasError = true
                            }

                            if (predecessor?.length === 0) {
                                setInputEmpty_predecessor(true)
                            }

                            if (!optimistic.trim()) {
                                setInputEmpty_optimistic(true)
                                hasError = true
                            }

                            if (!mostLikely.trim()) {
                                setInputEmpty_mostLikely(true)
                                hasError = true
                            }

                            if (!pessimistic.trim()) {
                                setInputEmpty_pessimistic(true)
                                hasError = true
                            }

                            if (hasError) {
                                console.log("Some inputs are empty")
                                return
                            }

                            try {
                                //insert data
                                updateActivityMutate({
                                    activity_name: activityName,
                                    optimistic: optimistic,
                                    mostLikely: mostLikely,
                                    pessimistic: pessimistic,
                                    project_id: projectId_,
                                    predecessors: predecessor,
                                    expected: expected_time
                                })

                            } catch (e) {
                                throw console.log(e)
                            }

                        }}>
                            <LinearGradient style={{ borderRadius: 10, padding: 10 }} colors={isPending ? ["#3A3F6B", "#3A3F6B"] : ["#63D0FF", "#427CE8", "#235691"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                                <Text style={{ textAlign: "center", color: "white", fontWeight: "600" }}>Update Task</Text>
                            </LinearGradient>
                        </Pressable>
                    </View>
                    <View style={styles.buttons}>
                        <Pressable onPress={() => {
                            // clear input
                            // setPredecessor([])
                            // setActivityName("")
                            // setOptimistic("")
                            // setMostLikely("")
                            // setPessimistic("")

                            setInputEmpty_activityName(false)
                            setInputEmpty_predecessor(false)
                            setInputEmpty_mostLikely(false)
                            setInputEmpty_optimistic(false)
                            setInputEmpty_pessimistic(false)

                            router.back()
                        }}>
                            <LinearGradient style={{ borderRadius: 10, padding: 10 }} colors={isPending ? ["#3A3F6B", "#3A3F6B"] : ["#63D0FF", "#427CE8", "#235691"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                                <Text style={{ textAlign: "center", color: "white", fontWeight: "600" }}>Cancel</Text>
                            </LinearGradient>
                        </Pressable>
                    </View>
                </View>
            </View>
            <Indicator message="Saving" isPending={isPending} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 28,
        flex: 1
    },
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

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center", // pushes modal to bottom
        alignItems: "center"
    },
    label: {
        color: "#AEB7DA",
        marginBottom: 5
    },
    input: {
        color: "#AEB7DA",
        height: 40,
        padding: 10,
        minWidth: "40%",
        backgroundColor: "#252A4A",
        borderRadius: 10,
    },
    column: {
        flexDirection: "column",
        gap: 5
    },
    row: {
        flexDirection: "row",
        gap: 10,
    },
    buttons: {
        minWidth: "40%"
    },
    placeholder: {
        color: "#575884"
    },
    item: {
        fontSize: 15,
        padding: 17,
    },
    fieldContainer: {
        marginBottom: 1,
    },
    itemContainer: {
    },
    itemText: {
        color: '#AEB7DA',
        fontSize: 15,
    },
    selectedText: {
        color: '#63D0FF',
        fontWeight: '600',
        fontSize: 15
    },
    selectedItem: {
        padding: 5,
        borderRadius: 10
    },
    expected_time:{
        justifyContent:"center", alignItems:"center"

    }
})