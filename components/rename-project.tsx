import { responsiveSize } from "@/utils/reponsiveSize";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface RenameModalProps {
  visible: boolean;
  initialValue?: string;
  onConfirm: (newName: string) => void;
  onCancel: () => void;
  existingNames?: string[];
}

export default function RenameModal({
  visible,
  initialValue = "",
  onConfirm,
  onCancel,
  existingNames = [],
}: RenameModalProps) {
  const [text, setText] = useState(initialValue);
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible) {
      setText(initialValue);
      setError("");
    }
  }, [visible, initialValue]);

  const nameExists = existingNames.some(

    (name) => {
      return name?.trim().toLowerCase() === text?.trim().toLowerCase()
    }
  );

  const isDuplicate = nameExists && text.trim() !== initialValue;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />

        <View style={styles.container}>
          <Text style={styles.title}>Rename Project</Text>

          <TextInput
            value={text}
            onChangeText={(value) => {
              setText(value);
              setError("");
            }}
            placeholder="New name"
            style={styles.input}
            placeholderTextColor="#AEB7DA"
          />

          {isDuplicate && (
            <Text style={styles.error}>
              A project with this name already exists.
            </Text>
          )}

          <View style={styles.buttonRow}>
            <Pressable style={[styles.button, styles.cancel]} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={[
                styles.button,
                styles.save,
                isDuplicate ? styles.disabled : null,
              ]}
              onPress={() => {
                const newName = text.trim();
                if (!newName) return;

                if (isDuplicate) {
                  setError("Name already exists");
                  return;
                }

                onConfirm(newName);
              }}
              disabled={isDuplicate}
            >
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    backgroundColor: "#070C27",
    padding: responsiveSize(20),
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#625B71",
    gap: responsiveSize(10),
  },
  title: {
    color: "white",
    fontSize: responsiveSize(18),
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#252A4A",
    borderRadius: 10,
    padding: 10,
    color: "white",
  },
  error: {
    color: "#F24B6F",
    fontSize: responsiveSize(12),
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  cancel: {
    backgroundColor: "#2E335A",
  },
  save: {
    backgroundColor: "#63D0FF",
  },
  disabled: {
    opacity: 0.5,
  },
  cancelText: {
    color: "#AEB7DA",
  },
  saveText: {
    color: "white",
    fontWeight: "600",
  },
});