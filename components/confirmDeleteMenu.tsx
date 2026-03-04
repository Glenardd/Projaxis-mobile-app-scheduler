import { responsiveSize } from "@/utils/reponsiveSize";
import React from "react";
import {
    Dimensions,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

interface ConfirmationModalProps {
    visible: boolean;
    onConfirm: () => void
    onCancel: () => void
    message?: string,
    title?: string
}

export default function ConfirmationModal({
    visible,
    onConfirm,
    onCancel,
    message,
    title 
}: ConfirmationModalProps) {

    return (
        <Modal
            animationType="none"
            transparent
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                {/* Close when tapping outside */}
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={onCancel}
                />

                <View style={styles.menuContainer}>
                    <View style={styles.container}>
                        <Text style={styles.title}>
                            {title ?? "Confirm Deletion"}
                        </Text>

                        <Text style={styles.message}>
                            {message ?? "Are you sure you want to delete this project?"}
                        </Text>

                        <View style={styles.buttonRow}>
                            <Pressable
                                style={[styles.button, styles.cancel]}
                                onPress={onCancel}
                            >
                                <Text style={styles.cancelText}>
                                    Cancel
                                </Text>
                            </Pressable>

                            <Pressable
                                style={[styles.button, styles.delete]}
                                onPress={onConfirm}
                            >
                                <Text style={styles.deleteText}>
                                    Confirm
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const { width } = Dimensions.get("screen")

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center"
    },

    menuContainer: {
        width: width - 30 * 2,
        backgroundColor: "#070C27",
        borderRadius: 20,
        padding: 25,
        borderWidth: 1,
        borderColor: "#625B71",
        justifyContent: "center",
        alignItems: "center",
    },

    container: {
        gap: 15,
        justifyContent: "center",
        alignItems: "center"
    },

    title: {
        color: "white",
        fontSize: responsiveSize(17),
        fontWeight: "600"
    },

    message: {
        color: "#AEB7DA",
        fontSize: responsiveSize(13)
    },

    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 30,
        marginTop: 10,
    },

    button: {
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 8,
        flex: 1,
        alignItems: "center"
    },

    cancel: {
        backgroundColor: "#2E335A"
    },

    delete: {
        backgroundColor: "#F24B6F"
    },

    cancelText: {
        color: "#AEB7DA"
    },

    deleteText: {
        color: "white",
        fontWeight: "600"
    }
});