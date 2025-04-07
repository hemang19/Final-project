import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const colors = ["#F5C6D6", "#B4E1C5", "#B5D8E8", "#C2AFF0", "#F4D58D"];

const AssignTaskScreen = () => {
  const navigation = useNavigation();
  const [taskOptions, setTaskOptions] = useState<{ label: string; value: string }[]>([]);
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      const stored = await AsyncStorage.getItem("tasks");
      const tasks = stored ? JSON.parse(stored) : [];
      const options = tasks.map((task: any) => ({
        label: task.title,
        value: task.title,
      }));
      setTaskOptions(options);
    };

    fetchTasks();
  }, []);

  const handleCreate = async () => {
    try {
      const response = await fetch("http://192.168.1.73:5000/send-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          from: "Deadlinez",
          taskName: selectedTask,
          description: `Assigned task: ${selectedTask}`,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Email sent successfully!");
        navigation.goBack();
      } else {
        alert("Failed to send: " + data.error);
      }
    } catch (err) {
      console.error("Error sending email", err);
      alert("Network error.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assign task:</Text>

      <Text style={styles.label}>Select task:</Text>
      <RNPickerSelect
        onValueChange={setSelectedTask}
        value={selectedTask}
        items={taskOptions}
        placeholder={{ label: "Choose a task", value: "" }}
        style={pickerStyles}
        Icon={() => <Ionicons name="chevron-down" size={20} color="#000" />}
      />

      <Text style={styles.label}>Select colour (optional):</Text>
      <View style={styles.colorRow}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorCircle,
              { backgroundColor: color },
              selectedColor === color && styles.selectedColorBorder,
            ]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>

      <Text style={styles.label}>Assign task:</Text>
      <TextInput
        placeholder="example@gmail.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.createButton]} onPress={handleCreate}>
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AssignTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  label: {
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
  },
  colorRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  selectedColorBorder: {
    borderWidth: 2,
    borderColor: "#000",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
  },
  createButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

const pickerStyles = {
  inputIOS: {
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#000",
  },
  inputAndroid: {
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#000",
  },
};
