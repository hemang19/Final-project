import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, KeyboardAvoidingView } from "react-native";
import Modal from "react-native-modal";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";


export default function AddTaskScreen({ navigation }) {
  const [taskName, setTaskName] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [assignedEmail, setAssignedEmail] = useState("");
  const [selectedColor, setSelectedColor] = useState("#F5F5F5");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const colors = ["#F5C6D6", "#B4E1C5", "#B5D8E8", "#C2AFF0", "#F4D58D"];
  const route = useRoute();
  const { username } = route.params as { username: string };

  React.useEffect(() => {
    if (username) {
      AsyncStorage.setItem("username", username);
    }
  }, [username]);

  const handleCreateTask = async () => {
    const newTask = {
      id: Math.random().toString(),
      title: taskName,
      date: selectedDate,
      assignedEmail: assignedEmail,
      selectedColor: selectedColor,
      daysRemaining: calculateDaysRemaining(selectedDate),
      urgent: calculateDaysRemaining(selectedDate) <= 3,
    };
  
    try {
      const data = await AsyncStorage.getItem("tasks");
      const existingTasks = data ? JSON.parse(data) : [];
      const updatedTasks = [...existingTasks, newTask].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
  

      if (assignedEmail) {
        const storedUsername = await AsyncStorage.getItem("username");
        await fetch("http://192.168.1.73:5000/send-invite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: assignedEmail,
            from: storedUsername || "Anonymous",
            taskName: taskName,
            description: `You have been assigned a new task. Due date: ${selectedDate}.`,
          }),
        });
      }
  
      setIsModalVisible(true);
      setTimeout(() => {
        navigation.goBack();
        setIsModalVisible(false);
      }, 1500);
    } catch (err) {
      console.error("Error creating task or sending email", err);
      alert("Something went wrong. Please try again.");
    }
  };  

  const calculateDaysRemaining = (taskDate) => {
    const dueDate = new Date(taskDate);
    const currentDate = new Date();
    const timeDifference = dueDate.getTime() - currentDate.getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
  };

  const handleCancel = () => {
    setTaskName("");
    setSelectedDate(null);
    setAssignedEmail("");
    setSelectedColor("#F5F5F5");
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}>
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
          markedDates={selectedDate ? { [selectedDate]: { selected: true, selectedColor: "#4CAF50" } } : {}}
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
            onPress={handleCancel}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Task has been successfully added!</Text>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
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
  }
});
