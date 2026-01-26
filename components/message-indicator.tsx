import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

export default function Indicator({ message,  isPending}: { message: string, isPending: boolean }) {
    return (
        <Modal
            visible={isPending}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.savingOverlay}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.savingText}>{message}...</Text>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
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
})