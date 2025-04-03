import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For icons
import { useNavigation } from "@react-navigation/native";

const AssignTaskScreen = () => {
  const navigation = useNavigation();
  
  // States to manage the inputs
  const [email, setEmail] = useState("");
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  
  const handleSend = () => {
    // Here, we simulate sending an email (you can later integrate actual email functionality)
    console.log(`Sending Task to ${email}:\nTask: ${taskName}\nDescription: ${description}`);
    
    // After sending, navigate back to Home Screen or show confirmation
    navigation.goBack();  // Go back to the home screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Assign Task</Text>
      
      {/* Input for email */}
      <TextInput
        style={styles.input}
        placeholder="Recipient's Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#B0B0B0"
      />
      
      {/* Input for task name */}
      <TextInput
        style={styles.input}
        placeholder="Task Name"
        value={taskName}
        onChangeText={setTaskName}
        placeholderTextColor="#B0B0B0"
      />
      
      {/* Input for task description */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Task Description"
        value={description}
        onChangeText={setDescription}
        multiline
        placeholderTextColor="#B0B0B0"
      />
      
      {/* Send Button */}
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendButtonText}>Send Task</Text>
        <Ionicons name="send" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default AssignTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F8F8", // Light background color
    justifyContent: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 30,
    color: "#333", // Dark text for readability
    textAlign: "center",
    letterSpacing: 1,
  },
  input: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
    borderColor: "#DDD",
    borderWidth: 1,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  sendButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#34C759", // Green for action
    borderRadius: 10,
    shadowColor: "#34C759",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 10,
  },
});
