import Indicator from "@/components/message-indicator";
import { useInsertActivity, useSearchActivity } from "@/services/activity.service";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import { ScrollView } from "react-native-gesture-handler";

interface PredecessorsTypes {
    label: string,
    value: string
}

export default function AddTaskContent() {

    const router = useRouter()

    const { project_id } = useLocalSearchParams<{ project_id: string }>();
    const { activity: data_, isRefetchingByUser, refetchByUser, isLoading } = useSearchActivity(parseInt(project_id))

    const [isFocus, setIsFocus] = useState(false);

    const [predecessor, setPredecessor] = useState<string[]>([]);
    const [activityName, setActivityName] = useState("")
    const [time, setTime] = useState("")

    const [inputEmpty_activityName, setInputEmpty_activityName] = useState(false);
    const [inputEmpty_time, setInputEmpty_time] = useState(false)
    const [inputEmpty_predecessor, setInputEmpty_predecessor] = useState(false);

    const { insert_Activity, isPending, isSuccess } = useInsertActivity()

    const data = data_?.map((item) => ({
        label: item.label,
        value: item.activity_name
    })) || []

    const isPredecessor = data_?.map((item) => {
        return item.predecessor ?? []
    }).length !== 0

    const renderItem = ({ value, label }: PredecessorsTypes) => {
        return (
            <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                <Text style={[{ color: "#59accfff" }, styles.item]}>{label}</Text>
                <Text style={styles.item}>{value}</Text>
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.column}>
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
                                data={data}
                                placeholderStyle={styles.placeholder}
                                labelField="label"
                                valueField="value"
                                placeholder={isFocus ? "..." : "Select"}
                                renderItem={renderItem}
                                value={predecessor}
                                onChange={(item) => {
                                    if (item === null) {
                                        console.log(item)
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
                    <Text style={styles.label}>Time</Text>
                    <TextInput
                        placeholder="Time"
                        placeholderTextColor={styles.placeholder.color}
                        style={[styles.input, { borderColor: inputEmpty_time ? "red" : "#625B71", borderWidth: 1 }]}
                        value={time}
                        onChangeText={(time) => {
                            setTime(time)

                            if (time.length > 0) {
                                setInputEmpty_time(false)
                            } else {
                                setInputEmpty_time(true)
                            }
                        }}
                        keyboardType="numeric"
                    />
                </View>
                <View style={[styles.row, { justifyContent: "space-between", paddingTop: 10 }]}>
                    <View style={styles.buttons}>
                        <Pressable disabled={isPending} onPress={async () => {

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

                            if (!time.trim()) {
                                setInputEmpty_time(true)
                                hasError = true
                            }

                            if (hasError) {
                                console.log("Some inputs are empty")
                                return
                            }

                            //insert data
                            try {
                                insert_Activity({
                                    activity_name: activityName,
                                    time: time,
                                    project_id: parseInt(project_id) || undefined,
                                    predecessors: predecessor,
                                })

                            } catch (e) {
                                console.log(e)
                            }

                        }}>
                            <LinearGradient style={{ borderRadius: 10, padding: 10 }} colors={isPending ? ["#3A3F6B", "#3A3F6B"] : ["#63D0FF", "#427CE8", "#235691"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                                <Text style={{ textAlign: "center", color: "white", fontWeight: "600" }}>Add Task</Text>
                            </LinearGradient>
                        </Pressable>
                    </View>
                    <View style={styles.buttons}>
                        <Pressable disabled={isPending} onPress={() => {
                            // clear input
                            setPredecessor([])
                            setActivityName("")
                            setTime("")

                            setInputEmpty_activityName(false)
                            setInputEmpty_predecessor(false)
                            setInputEmpty_time(false)

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
    expected_time: {
        justifyContent: "center", alignItems: "center"

    }
})