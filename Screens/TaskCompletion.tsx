import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

const TaskCompletionScreen = () => {
  const route = useRoute();
  const { taskId } = route.params;
  
  // Assuming tasks are stored in AsyncStorage and we retrieve them based on taskId
  const [task, setTask] = React.useState(null);

  React.useEffect(() => {
    const loadTask = async () => {
      const storedTasks = await AsyncStorage.getItem("tasks");
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      const selectedTask = tasks.find((task) => task.id === taskId);
      setTask(selectedTask);
    };

    loadTask();
  }, [taskId]);

  if (!task) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Completed</Text>
      <View style={styles.taskCard}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskDate}>Due: {task.date}</Text>
        <Text style={styles.taskStatus}>Completed</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text style={styles.buttonText}>Back to Tasks</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  taskCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  taskDate: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  taskStatus: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "bold",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TaskCompletionScreen;
