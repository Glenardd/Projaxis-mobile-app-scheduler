import { getDynamicTextStyle } from "@/utils/textResponsive";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export default function ActivityNameModal({ activity_name, visible, onclose }: { activity_name: string, visible: boolean, onclose: () => void }) {

    const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center"
        },

        menuContainer: {
            backgroundColor: "white",
            borderRadius: 20,
            padding: 25,
            borderWidth: 1,
            borderColor: "#625B71",
            justifyContent: "center",
            alignItems: "center",
        },
    })

    return (
        <Modal
            animationType="none"
            transparent
            visible={visible}
            onRequestClose={() => onclose()}
        >
            <View style={styles.overlay}>
                {/* Close when tapping outside */}
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={() => onclose()}
                />
                <View style={styles.menuContainer}>
                    <Text style={getDynamicTextStyle(activity_name)}>{activity_name}</Text>
                </View>
            </View>
        </Modal>
    )
};