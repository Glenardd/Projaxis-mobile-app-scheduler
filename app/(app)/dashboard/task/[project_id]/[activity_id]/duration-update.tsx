import Indicator from "@/components/message-indicator";
import { useActivityById, useSearchActivity, useUpdateActivity } from "@/services/activity.service";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import { ScrollView } from "react-native-gesture-handler";

interface PredecessorsTypes {
    label: string
    value: string | number
    name: string
}

export default function ActivityEditDuration() {

    const router = useRouter()

    const { activity_id } = useLocalSearchParams<{ activity_id: string }>()
    const { project_id } = useLocalSearchParams<{ project_id: string }>()

    const { isPending, isSuccess, updateActivityMutate } = useUpdateActivity(parseInt(activity_id), () => {
        router.back() // on success
    })

    const { activity: activityById, refetchByUser: refetchByUserById, isRefetchingByUser: isRefetchingByUserById, isLoading: loadingActivity } = useActivityById(parseInt(activity_id))
    const { activity: searchedActivity, refetchByUser: refetchByUserSearch, isRefetchingByUser: isRefetchingByUserSearch, isLoading: loadingSearchActivity } = useSearchActivity(parseInt(project_id))

    // values from db
    const activity_name_ = activityById?.activity_name
    const projectId_ = activityById?.project_id
    const activity_id_ = activityById?.id
    const predecessor_ = activityById?.predecessor
    const duration_ = activityById?.expected

    const [isFocus, setIsFocus] = useState(false);

    const [selected, setSelected] = useState<string[]>([]) // selects the id of the predecessor
    const [predecessor, setPredecessor] = useState<string[]>([]) // sets the final predecessor

    const [activityName, setActivityName] = useState("")
    const [duration, setDuration] = useState("")

    const [inputEmpty_activityName, setInputEmpty_activityName] = useState(false)
    const [inputEmpty_duraton, setInputEmpty_duration] = useState(false)
    const [inputEmpty_predecessor, setInputEmpty_predecessor] = useState(false)

    // find the activity from the predecessor
    const activity_predecessor = searchedActivity?.filter((item) => predecessor_?.includes(item.label))
    const predecessor_content = activity_predecessor?.map((item) => ({
        label: item.label,
        value: item.id,
        name: item.activity_name
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

    useEffect(() => {
        if (!activityById) return
        setActivityName(activity_name_ ?? "")
        setDuration(duration_ != null ? String(duration_) : "")
        setSelected(predecessor_content ? predecessor_content.map(item => item.name) : [])

    }, [activityById, predecessor_content])

    const renderItem = ({ value, label }: PredecessorsTypes) => {
        return (
            <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                <Text style={[{ color: "#59accfff" }, styles.item]}>{label}</Text>
                <Text style={styles.item}>{value}</Text>
            </View>
        );
    };

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }} style={styles.container}>
            {/* while data is fetching initiate loading */}
            <Indicator message="Loading" isPending={loadingActivity} />

            <View style={styles.column}>
                {/* activity name */}
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
                        maxLength={60}
                    />
                </View>

                {/* Predecessor select */}
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
                                value={selected}
                                onChange={(item) => {
                                    console.log("Items is: ", item)
                                    if (item === null) {
                                        setIsFocus(false)
                                        setInputEmpty_predecessor(true)

                                        return setPredecessor([])
                                    } else {
                                        setInputEmpty_predecessor(false)

                                        const numericItems = item.map(Number)

                                        const selectedNames = searchedActivity
                                            ?.filter(activity => numericItems.includes(activity.id))  // no String() conversion, both are numbers
                                            .map(activity => activity.activity_name) || []

                                        console.log(selectedNames)
                                        setPredecessor(selectedNames)

                                        return setSelected(item)
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

                {/* duration */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Duration</Text>
                    <TextInput
                        placeholder="Time"
                        placeholderTextColor={styles.placeholder.color}
                        style={[styles.input, { borderColor: inputEmpty_duraton ? "red" : "#625B71", borderWidth: 1 }]}
                        value={duration}
                        onChangeText={(text) => {
                            setDuration(text)

                            if (text.trim().length > 0) {
                                setInputEmpty_duration(false)
                            } else {
                                setInputEmpty_duration(true)
                            }
                        }}
                        keyboardType="numeric"
                    />
                </View>

                {/* update task */}
                <View style={[styles.row, { justifyContent: "space-between", paddingTop: 10 }]}>
                    <View style={styles.buttons}>
                        <Pressable onPress={async () => {

                            // console.log("activity_name: ", inputEmpty_activityName)
                            // console.log("optimistic: ", inputEmpty_optimistic)
                            // console.log("predecessor: ", inputEmpty_predecessor)

                            let hasError = false

                            if (!activityName.trim()) {
                                setInputEmpty_activityName(true)
                                hasError = true
                            }

                            if (predecessor?.length === 0) {
                                setInputEmpty_predecessor(true)
                            }

                            if (!duration.trim()) {
                                setInputEmpty_duration(true)
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
                                    optimistic: "",
                                    mostLikely: "",
                                    pessimistic: "",
                                    project_id: projectId_,
                                    predecessors: predecessor,
                                    expected: parseInt(duration)
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
                            setInputEmpty_activityName(false)
                            setInputEmpty_predecessor(false)
                            setInputEmpty_duration(false)

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
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 28,
        paddingRight: 28,
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
        padding: 10,
        backgroundColor: "#252A4A",
        borderRadius: 10,
    },
    column: {
        flexDirection: "column",
        gap: 3
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
    expected_time: {
        justifyContent: "center", alignItems: "center"

    }
})