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
import { useRoute } from "@react-navigation/native";

const colors = ["#F5C6D6", "#B4E1C5", "#B5D8E8", "#C2AFF0", "#F4D58D"];

const AssignTaskScreen = () => {
  const navigation = useNavigation();
  const [taskOptions, setTaskOptions] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [email, setEmail] = useState("");
  const route = useRoute();
  const { username } = route.params as { username: string };

  useEffect(() => {
    const fetchTasks = async () => {
      const stored = await AsyncStorage.getItem("tasks");
      const tasks = stored ? JSON.parse(stored) : [];

      const pendingTasks = tasks.filter((task: any) => !task.completed);
  
      const options = pendingTasks.map((task: any) => ({
        label: task.title,
        value: task.id,
        task,
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
          from: username || "Anonymous", // now pulled from route params
          taskName: selectedTask?.title,
          description: `You have been assigned a new task. Due date: ${selectedTask?.date}.`,
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
      <Text style={styles.title}>Assign Task</Text>

      <Text style={styles.label}>Select Task:</Text>
      <RNPickerSelect
        onValueChange={(value) => {
          const fullTask = taskOptions.find((option) => option.value === value)?.task;
          setSelectedTask(fullTask || null);
        }}
        value={selectedTask?.id || ""}
        items={taskOptions}
        placeholder={{ label: "Choose a task", value: "" }} // use empty string instead of null
        style={pickerStyles}
        Icon={() => <Ionicons name="chevron-down" size={20} color="#000" />}
      />

      <Text style={styles.label}>Select Colour (optional):</Text>
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

      <Text style={styles.label}>Assign Task:</Text>
      <TextInput
        placeholder="example@gmail.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.createButton]} onPress={handleCreate}>
          <Text style={styles.buttonText}>Assign</Text>
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
    backgroundColor: "#F5F5F5",
    marginTop: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left",
  },
  label: {
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 14,
    color: "#000",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  inputAndroid: {
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 14,
    color: "#000",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  iconContainer: {
    top: 12,
    right: 10,
  },
};
