import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Task = {
  id: string;
  title: string;
  date: string;
  completed?: boolean;
};

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { username } = route.params as { username: string };

  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadTasks = async () => {
        const storedTasks = await AsyncStorage.getItem("tasks");
        if (storedTasks) {
          const parsedTasks: Task[] = JSON.parse(storedTasks);

          // ✅ Only include tasks that are NOT completed
          const filteredTasks = parsedTasks.filter((task) => !task.completed);

          // Sort by date ascending
          const sortedTasks = filteredTasks.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

          // Show up to 4 tasks
          setUpcomingTasks(sortedTasks.slice(0, 4));
        }
      };

      loadTasks();
    }, [])
  );

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskCard}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDate}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Good Morning, {username}!</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.progressButton}
          onPress={() => navigation.navigate("Progress")}
        >
          <Text style={styles.buttonText}>Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.recentButton}
          onPress={() => navigation.navigate("RecentTasks")}
        >
          <Text style={styles.buttonText}>Recent</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.taskListContainer}>
        <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
        <FlatList
          data={upcomingTasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No upcoming tasks for now.</Text>
          }
        />
      </View>

      <Text style={styles.sectionTitle}>Start your day</Text>
      <TouchableOpacity
        style={styles.linkRow}
        onPress={() => navigation.navigate("ViewTasks")}
      >
        <Text style={styles.linkText}>View Tasks</Text>
        <Ionicons name="arrow-forward" size={20} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.linkRow}
        onPress={() => navigation.navigate("AddTask", { username })}
      >
        <Text style={styles.linkText}>Add Tasks</Text>
        <Ionicons name="add" size={20} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.linkRow}
        onPress={() => navigation.navigate("AssignTask", { username })}
      >
        <Text style={styles.linkText}>Assign Task</Text>
        <Ionicons name="person-add" size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  progressButton: {
    backgroundColor: "#1E90FF",
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  recentButton: {
    backgroundColor: "#32CD32",
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  taskListContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  taskCard: {
    backgroundColor: "#E6F0FA",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  taskDate: {
    fontSize: 14,
    color: "#FF3B30",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
