import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";

type Task = {
  id: string;
  title: string;
  date: string;
  assignedEmail: string;
  selectedColor: string | null;
  daysRemaining: number;
  urgent: boolean;
};

const ViewTasksScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // Load tasks from AsyncStorage when the component mounts
  useFocusEffect(
    useCallback(() => {
      const loadTasks = async () => {
        const storedTasks = await AsyncStorage.getItem("tasks");
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        } else {
          setTasks([]); // Clear if nothing
        }
      };

      loadTasks();
    }, [])
  );

  const confirmDeleteTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsDeleteModalVisible(true);
  };

  const deleteTask = async () => {
    if (selectedTaskId) {
      const updatedTasks = tasks.filter((task) => task.id !== selectedTaskId);
      setTasks(updatedTasks);
      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setIsDeleteModalVisible(false);
      setSelectedTaskId(null);
    }
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={[styles.taskCard, { borderLeftColor: item.selectedColor || "#000" }]}>
      <View>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={item.urgent ? styles.urgentDate : styles.taskDate}>
          {item.date} {item.urgent && `• ${item.daysRemaining} days remaining`}
        </Text>
      </View>
      <TouchableOpacity onPress={() => confirmDeleteTask(item.id)}>
        <Ionicons name="ellipsis-horizontal" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>View Tasks</Text>
              <TouchableOpacity onPress={() => navigation.navigate("AddTask")} style={{ padding: 8 }}>
                <Ionicons name="add-circle-outline" size={28} color="black" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Tasks</Text>
          </>
        }
      />

      <Modal isVisible={isDeleteModalVisible} onBackdropPress={() => setIsDeleteModalVisible(false)} style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Confirm deletion of task:</Text>
          {selectedTaskId && (
            <>
              <Text style={styles.modalTaskTitle}>
                {tasks.find((task) => task.id === selectedTaskId)?.title}
              </Text>
              <Text style={styles.modalTaskDate}>
                Due on {tasks.find((task) => task.id === selectedTaskId)?.date}
              </Text>
            </>
          )}
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={deleteTask} style={[styles.modalButton, styles.confirmButton]}>
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsDeleteModalVisible(false)} style={[styles.modalButton, styles.cancelButton]}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  listContainer: {
    padding: 20,
    backgroundColor: "#F5F5F5",
    flexGrow: 1,
  },
  taskCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 5,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  taskDate: {
    fontSize: 14,
    color: "#666",
  },
  urgentDate: {
    fontSize: 14,
    color: "#D32F2F",
    fontWeight: "bold",
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0, // Ensures modal is centered on the screen
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalTaskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalTaskDate: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 6,
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#D32F2F",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14, // Adjusted font size for better readability
  },
});

export default ViewTasksScreen;
