import Indicator from "@/components/message-indicator";
import { useInsertActivity, useSearchActivity } from "@/services/activity.service";
import { pert } from "@/utils/pert";
import { responsiveSize } from "@/utils/reponsiveSize";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import { ScrollView } from "react-native-gesture-handler";

interface PredecessorsTypes {
    label: string
    value: number
    name: string
}

export default function AddTaskContentPertCalculate() {

    const router = useRouter()

    const { project_id } = useLocalSearchParams<{ project_id: string }>();
    const { activity: data_, isRefetchingByUser, refetchByUser, isLoading } = useSearchActivity(parseInt(project_id))

    const [isFocus, setIsFocus] = useState(false);

    const [selected, setSelected] = useState<string[]>([]) // selects the id of the predecessor
    const [predecessor, setPredecessor] = useState<string[]>([]) // sets the final predecessor

    const [activityName, setActivityName] = useState("")
    const [optimistic, setOptimistic] = useState("")
    const [mostLikely, setMostLikely] = useState("")
    const [pessimistic, setPessimistic] = useState("")

    const [inputEmpty_activityName, setInputEmpty_activityName] = useState(false);
    const [inputEmpty_optimistic, setInputEmpty_optimistic] = useState(false)
    const [inputEmpty_pessimistic, setInputEmpty_pessimistic] = useState(false);
    const [inputEmpty_mostLikey, setInputEmpty_mostLikely] = useState(false);
    const [inputEmpty_predecessor, setInputEmpty_predecessor] = useState(false);

    const { insert_Activity, isSuccess, isPending } = useInsertActivity(() => {
        router.back() //on success
    })

    const data = data_?.map((item) => ({
        label: item.label,
        value: item.id,
        name: item.activity_name
    })) || []

    const isPredecessor = data_?.map((item) => {
        return item.predecessor ?? []
    }).length !== 0

    const expected_time = pert({ optimistic: optimistic, mostLikely: mostLikely, pessimistic: pessimistic })

    const renderItem = ({ value, name, label }: PredecessorsTypes) => {
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
                {/* pert */}
                <View style={styles.expected_time}>
                    <Text style={styles.label}>Duration/Time</Text>
                    <Text style={{ color: "white", fontSize: 50 }}>{!expected_time ? 0 : expected_time}d</Text>
                </View>

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
                                value={selected}
                                onChange={(item) => {
                                    if (item === null) {
                                        console.log(item)
                                        setIsFocus(false)
                                        setInputEmpty_predecessor(true)

                                        return setPredecessor([])
                                    } else {
                                        setInputEmpty_predecessor(false)

                                        const numericItems = item.map(Number)

                                        const selectedNames = data_
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

                {/* optimistic */}
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

                {/* most likely */}
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

                {/* pessimistic */}
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

                            //insert data
                            try {
                                insert_Activity({
                                    activity_name: activityName,
                                    optimistic: optimistic,
                                    mostLikely: mostLikely,
                                    pessimistic: pessimistic,
                                    project_id: parseInt(project_id) || undefined,
                                    predecessors: predecessor,
                                    expected: pert({ optimistic: optimistic, mostLikely: mostLikely, pessimistic: pessimistic }),
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
                            setOptimistic("")
                            setMostLikely("")
                            setPessimistic("")

                            setInputEmpty_activityName(false)
                            setInputEmpty_predecessor(false)
                            setInputEmpty_mostLikely(false)
                            setInputEmpty_optimistic(false)
                            setInputEmpty_pessimistic(false)

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