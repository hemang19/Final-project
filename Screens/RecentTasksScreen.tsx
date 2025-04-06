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
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

type Task = {
  id: string;
  title: string;
  date: string;
  completed?: boolean;
};

const RecentTasksScreen = () => {
  const navigation = useNavigation();
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadRecentCompleted = async () => {
      const stored = await AsyncStorage.getItem("tasks");
      const tasks: Task[] = stored ? JSON.parse(stored) : [];

      const completed = tasks
        .filter((task) => task.completed)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);

      setRecentTasks(completed);
    };

    loadRecentCompleted();
  }, []);

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.taskCard}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDate}>{item.date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={recentTasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Recent Tasks</Text>
              <View style={{ width: 24 }} />
            </View>
            <Text style={styles.sectionTitle}>Completed</Text>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default RecentTasksScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  listContainer: {
    padding: 20,
    flexGrow: 1,
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
    marginBottom: 10,
  },
  taskCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50", // Green to show completion
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  taskDate: {
    fontSize: 14,
    color: "#666",
  },
});
