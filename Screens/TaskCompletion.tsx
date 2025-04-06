import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

type Task = {
  id: string;
  title: string;
  date: string;
  completed?: boolean;
};

const TaskCompletionScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { taskId, username } = route.params as { taskId: string; username: string };

  const [dateToday, setDateToday] = useState("");
  const [completedTask, setCompletedTask] = useState<Task | null>(null);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setDateToday(formatted);

    const loadTasks = async () => {
      const stored = await AsyncStorage.getItem("tasks");
      const tasks: Task[] = stored ? JSON.parse(stored) : [];

      const completed = tasks.find((task) => task.id === taskId);
      const upcoming = tasks.filter(
        (task) => task.id !== taskId && !task.completed
      );

      setCompletedTask(completed || null);
      setUpcomingTasks(upcoming);
    };

    loadTasks();
  }, []);

  const renderTaskCard = (task: Task) => (
    <View style={styles.taskCard}>
      <Text style={styles.taskTitle}>{task.title}</Text>
      <Text style={styles.taskDate}>{task.date}</Text>
    </View>
  );

  const handleGoHome = () => {
    
    navigation.goBack();
    setTimeout(() => {
      navigation.goBack();
    }, 100); 
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back and add */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Summary</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddTask")} style={{ padding: 8 }}>
          <Ionicons name="add-circle-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Tasks due this month</Text>
      <Text style={styles.date}>{dateToday}</Text>

      {/* Task Complete Message */}
      <Text style={styles.success}>Task complete 🎉</Text>

      {/* ✅ Completed Task Card */}
      {completedTask && renderTaskCard(completedTask)}

      {/* 📌 Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Upcoming tasks</Text>
          <FlatList
            data={upcomingTasks}
            renderItem={({ item }) => renderTaskCard(item)}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 30 }}
          />
        </>
      )}

      {/* 🏠 Home Button */}
      <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
        <Text style={styles.homeButtonText}>🏠 Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default TaskCompletionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  date: {
    fontSize: 26,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginTop: 4,
    marginBottom: 20,
  },
  success: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  taskCard: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  taskDate: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  homeButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
