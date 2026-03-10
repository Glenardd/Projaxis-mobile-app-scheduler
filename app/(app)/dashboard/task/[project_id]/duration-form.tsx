import Indicator from "@/components/message-indicator";
import { useInsertActivityDuration, useSearchActivity } from "@/services/activity.service";
import { responsiveSize } from "@/utils/reponsiveSize";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import { ScrollView } from "react-native-gesture-handler";

interface PredecessorsTypes {
    label: string
    value: string | number
    name: string
}

export default function AddTaskContentDuration() {

    const router = useRouter()

    const { project_id } = useLocalSearchParams<{ project_id: string }>();
    const { activity: data_, isRefetchingByUser, refetchByUser, isLoading } = useSearchActivity(parseInt(project_id))

    const [isFocus, setIsFocus] = useState(false);

    const [predecessor, setPredecessor] = useState<string[]>([]);
    const [activityName, setActivityName] = useState("")
    const [duration, setDuration] = useState("")

    const [inputEmpty_duration, setInputEmpty_duration] = useState(false)
    const [inputEmpty_activityName, setInputEmpty_activityName] = useState(false)
    const [inputEmpty_predecessor, setInputEmpty_predecessor] = useState(false)

    const { insert_Activity_duration, isSuccess, isPending } = useInsertActivityDuration(() => {
        router.back() //on success
    })

    const data = data_?.map((item) => ({
        label: item.label,
        value: item.id,           // unique identifier — NOT activity_name
        name: item.activity_name
    })) || []

    const isPredecessor = data_?.map((item) => {
        return item.predecessor ?? []
    }).length !== 0

    const renderItem = ({ value, label, name }: PredecessorsTypes) => {
        return (
            <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                <Text style={[{ color: "#59accfff" }, styles.item]}>{label}</Text>
                <Text style={styles.item}>{name}</Text>
            </View>
        );
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{
                paddingBottom: 50,
            }}
        >
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

                {/* Duration */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Duration</Text>
                    <TextInput
                        placeholder="Time"
                        placeholderTextColor={styles.placeholder.color}
                        style={[styles.input, { borderColor: inputEmpty_duration ? "red" : "#625B71", borderWidth: 1 }]}
                        value={duration}
                        onChangeText={(optimistic) => {
                            setDuration(optimistic)

                            if (optimistic.length > 0) {
                                setInputEmpty_duration(false)
                            } else {
                                setInputEmpty_duration(true)
                            }
                        }}
                        keyboardType="numeric"
                    />
                </View>

                {/* add task */}
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

                            if (!duration.trim()) {
                                setInputEmpty_duration(true)
                                hasError = true
                            }

                            if (hasError) {
                                console.log("Some inputs are empty")
                                return
                            }

                            //insert data
                            try {
                                insert_Activity_duration({
                                    activity_name: activityName,
                                    project_id: parseInt(project_id) || undefined,
                                    predecessors: predecessor,
                                    expected: parseInt(duration),
                                    isDone: false
                                })

                            } catch (e) {
                                console.log(e)
                            }

                        }}>
                            <LinearGradient style={{ borderRadius: 10, padding: responsiveSize(10) }} colors={isPending ? ["#3A3F6B", "#3A3F6B"] : ["#63D0FF", "#427CE8", "#235691"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                                <Text style={{ textAlign: "center", color: "white", fontWeight: "600" }}>Add Task</Text>
                            </LinearGradient>
                        </Pressable>
                    </View>

                    {/* cancel */}
                    <View style={styles.buttons}>
                        <Pressable onPress={() => {
                            // clear input
                            // clear input
                            setPredecessor([])
                            setActivityName("")
                            setDuration("")

                            setInputEmpty_activityName(false)
                            setInputEmpty_predecessor(false)
                            setInputEmpty_duration(false)

                            router.back()
                        }}>
                            <LinearGradient style={{ borderRadius: 10, padding: responsiveSize(10) }} colors={isPending ? ["#3A3F6B", "#3A3F6B"] : ["#63D0FF", "#427CE8", "#235691"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
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
        padding: responsiveSize(28),
    },
    label: {
        color: "#AEB7DA",
        marginBottom: responsiveSize(5)
    },
    input: {
        color: "#AEB7DA",
        padding: responsiveSize(10),
        backgroundColor: "#252A4A",
        borderRadius: 10,
    },
    column: {
        flexDirection: "column",
        gap: responsiveSize(5)
    },
    row: {
        flexDirection: "row",
        gap: responsiveSize(10),
    },
    buttons: {
        minWidth: "40%"
    },
    placeholder: {
        color: "#575884"
    },
    item: {
        fontSize: 15,
        padding: responsiveSize(17),
    },
    fieldContainer: {
        marginBottom: 1,
    },
    itemContainer: {
    },
    itemText: {
        color: '#AEB7DA',
        fontSize: responsiveSize(15),
    },
    selectedText: {
        color: '#63D0FF',
        fontWeight: '600',
        fontSize: responsiveSize(15)
    },
    selectedItem: {
        padding: responsiveSize(5),
        borderRadius: 10
    },
    expected_time: {
        justifyContent: "center", alignItems: "center"
    }
})