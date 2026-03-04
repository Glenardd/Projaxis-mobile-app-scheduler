import { ActivityWithTiming } from "@/utils/cpm";
import { responsiveSize } from "@/utils/reponsiveSize";
import { getDynamicTextStyle } from "@/utils/textResponsive";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface ScheduleInfoTypes {
    isVisible: boolean;
    onClose: () => void;
    nodeData?: ActivityWithTiming;
}

export default function ScheduleInfo({
    isVisible,
    onClose,
    nodeData,
}: ScheduleInfoTypes) {

    const styles = StyleSheet.create({
        modalCard: {
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            width: "70%",
            maxWidth: 450,
        },

        modalContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },

        modalOverlay: {
            backgroundColor: "rgba(0,0,0,0.4)",
            flex: 1,
            justifyContent: "center",
        },
        activity_name: {
            fontWeight: "600",
            fontSize: responsiveSize(30),
            color:"white"
        },

        critical: {
            backgroundColor: "#F24B6F",
            width: responsiveSize(40),
            alignItems: "center",
            borderRadius: 10,
        },

        nonCritical: {
            backgroundColor: "#5fc1ebff",
            width: responsiveSize(40),
            alignItems: "center",
            borderRadius: 10,
        },
        modalDivider: {
            borderWidth: 1.5,
            padding: 10,
            borderRadius: 5,
            borderColor: "#e1e1e1ff",
            marginVertical: 5
        }
    })

    const {
        activity_name = "",
        label = "",
        optimistic = 0,
        most_likely = 0,
        pessimistic = 0,
        ES = 0,
        EF = 0,
        LS = 0,
        LF = 0,
        slack = 0,
        predecessor = [],
    } = nodeData ?? {};

    const isCritical = slack === 0 ? styles.critical : styles.nonCritical

    return (
        <Modal animationType="fade" visible={isVisible} transparent>
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalCard}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center",marginBottom: 10 }}>
                            <Text style={[styles.activity_name, getDynamicTextStyle(activity_name), {color:"black"}]}>{activity_name}</Text>
                            <View style={isCritical}>
                                <Text style={styles.activity_name}>{label}</Text>
                            </View>
                        </View>

                        <View style={styles.modalDivider}>
                            <Text>Optimistic: {optimistic} day/s</Text>
                            <Text>Most Likely: {most_likely} day/s</Text>
                            <Text>Pessimistic: {pessimistic} day/s</Text>
                        </View>
                        <View style={styles.modalDivider}>
                            <Text>Early Start: {ES} day/s</Text>
                            <Text>Early Finish: {EF} day/s</Text>
                        </View>
                        <View style={styles.modalDivider}>
                            <Text>Latest Start: {LS} day/s</Text>
                            <Text>Latest Finish: {LF} day/s</Text>
                        </View>
                        <View style={styles.modalDivider}>
                            <Text>Float: {slack} day/s</Text>
                            {predecessor.length > 0 && (
                                <Text>Predecessor: {predecessor.join(", ")}</Text>
                            )}
                        </View>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
}
