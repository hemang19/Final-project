import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  // Load tasks from AsyncStorage when the component mounts
  useEffect(() => {
    const loadTasks = async () => {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        // Ensure that the tasks are parsed correctly
        setTasks(JSON.parse(storedTasks));
      }
    };
    loadTasks();
  }, []);  // Empty dependency ensures this runs once when the component mounts

  // Add new task from AddTask screen if passed via route
  useEffect(() => {
    if (route.params?.newTask) {
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks, route.params.newTask]; // Append the new task
        AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks)); // Save the updated tasks list
        return updatedTasks;
      });
    }
  }, [route.params?.newTask]); // This will trigger whenever a new task is passed via route

  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={[styles.taskCard, { borderLeftColor: item.selectedColor || "#000" }]}>
      <View>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={item.urgent ? styles.urgentDate : styles.taskDate}>
          {item.date} {item.urgent && `• ${item.daysRemaining} days remaining`}
        </Text>
      </View>
      <TouchableOpacity>
        <Ionicons name="ellipsis-horizontal" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>View Tasks</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddTask")}>
          <Ionicons name="add-circle-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Task Lists */}
      <Text style={styles.sectionTitle}>Tasks</Text>
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
      />
    </View>
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
});

export default ViewTasksScreen;
