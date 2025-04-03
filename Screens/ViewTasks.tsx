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

    <Modal isVisible={isDeleteModalVisible} onBackdropPress={() => setIsDeleteModalVisible(false)}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>Are you sure you want to delete this task?</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
          <TouchableOpacity onPress={deleteTask}>
            <Text style={{ color: "red", fontWeight: "bold" }}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsDeleteModalVisible(false)}>
            <Text style={{ color: "green", fontWeight: "bold" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  safeArea: {
    flex: 1,
  },
});

export default ViewTasksScreen;
