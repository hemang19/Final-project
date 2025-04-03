import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from "react-native";
import Modal from "react-native-modal";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddTaskScreen({ navigation }: any) {
  const [taskName, setTaskName] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [assignedEmail, setAssignedEmail] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const colors = ["#F5C6D6", "#B4E1C5", "#B5D8E8", "#C2AFF0", "#F4D58D"];

  const handleCreateTask = () => {
    // Create the task object
    const newTask = {
      id: Math.random().toString(),
      title: taskName,
      date: selectedDate,
      assignedEmail: assignedEmail,
      selectedColor: selectedColor,
      daysRemaining: calculateDaysRemaining(selectedDate),
      urgent: calculateDaysRemaining(selectedDate) <= 3, // Urgent if less than 3 days
    };

    // Save the new task to AsyncStorage
    AsyncStorage.getItem("tasks").then((data) => {
      const existingTasks = data ? JSON.parse(data) : [];

      // Add new task and sort them chronologically by date
      const updatedTasks = [...existingTasks, newTask].sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    });

    // Show success modal
    setIsModalVisible(true);

    // Navigate back after a short delay (no newTask passed via route)
    setTimeout(() => {
      navigation.goBack();
      setIsModalVisible(false);
    }, 1500);
  };

  const calculateDaysRemaining = (taskDate: string) => {
    const dueDate = new Date(taskDate);
    const currentDate = new Date();
    const timeDifference = dueDate.getTime() - currentDate.getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Add New Task</Text>

      <TextInput
        placeholder="Task name"
        value={taskName}
        onChangeText={setTaskName}
        style={styles.inputField}
      />

      <Text style={styles.label}>Select Due Date:</Text>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={
          selectedDate ? { [selectedDate]: { selected: true, selectedColor: "#4CAF50" } } : {}
        }
        style={styles.calendar}
      />

      <Text style={styles.label}>Select Color (Optional):</Text>
      <View style={styles.colorPicker}>
        {colors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.colorOption, { backgroundColor: color }, selectedColor === color && styles.selectedColor]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>

      <TextInput
        placeholder="Assign task (example@gmail.com)"
        value={assignedEmail}
        onChangeText={setAssignedEmail}
        keyboardType="email-address"
        style={styles.inputField}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.createButton]}
          onPress={handleCreateTask}
        >
          <Text style={styles.buttonText}>Create Task</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => {
            setTaskName("");
            setSelectedDate(null);
            setAssignedEmail("");
            setSelectedColor(null);
          }}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Modal to show confirmation */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Task has been successfully added!</Text>
        </View>
      </Modal>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },  
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
    paddingTop: Platform.OS === "ios" ? 40 : 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  calendar: {
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
  },
  colorPicker: {
    flexDirection: "row",
    marginBottom: 15,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: "#000",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  createButton: {
    backgroundColor: "#4CAF50",
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#D32F2F",
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
