import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";

type Task = {
  id: string;
  title: string;
  date: string;
  completed?: boolean;
};

const TaskCompletionScreen = () => {
  const route = useRoute();
  const { taskId } = route.params as { taskId: string };

  const [dateToday, setDateToday] = useState("");
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
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

      const completed = tasks.filter((task) => task.completed);
      const upcoming = tasks.filter(
        (task) => task.id !== taskId && !task.completed
      );

      setCompletedTasks(completed);
      setUpcomingTasks(upcoming);
    };

    loadTasks();
  }, [taskId]);

  const renderTaskCard = (task: Task) => (
    <View style={styles.taskCard}>
      <Text style={styles.taskTitle}>{task.title}</Text>
      <Text style={styles.taskDate}>{task.date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Date & Add Button */}
      <View style={styles.header}>
        <Text style={styles.date}>{dateToday}</Text>
      </View>

      <Text style={styles.subtitle}>Tasks due this month</Text>

      {/* Task Complete Message */}
      <Text style={styles.success}>Task complete 🎉</Text>

      {/*  Completed Task Cards */}
      {completedTasks.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Completed Tasks</Text>
          <FlatList
            data={completedTasks}
            renderItem={({ item }) => renderTaskCard(item)}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 30 }}
          />
        </>
      )}

      {/*  Upcoming Tasks */}
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
});
