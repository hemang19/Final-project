import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Sample Task Data
const tasksDueThisMonth = [
  { id: "1", title: "Capstone phase 1 presentation", date: "March 7, 2025", daysRemaining: 2, urgent: true },
  { id: "2", title: "Capstone phase 2 presentation", date: "March 20, 2025", urgent: false },
  { id: "3", title: "Web app assignment 4", date: "March 21, 2025", urgent: false },
  { id: "4", title: "Software analysis report", date: "March 27, 2025", urgent: false },
];

const upcomingTasks = [{ id: "5", title: "Capstone final presentation", date: "April 24, 2025", urgent: false }];

const ViewTasksScreen = () => {
  const navigation = useNavigation();

  // Render each task item
  const renderTaskItem = ({ item }: { item: any }) => (
    <View style={styles.taskCard}>
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
        <Text style={styles.headerTitle}>March 5, 2025</Text>
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Task Lists */}
      <Text style={styles.sectionTitle}>Tasks due this month</Text>
      <FlatList data={tasksDueThisMonth} renderItem={renderTaskItem} keyExtractor={(item) => item.id} />

      <Text style={styles.sectionTitle}>Upcoming tasks</Text>
      <FlatList data={upcomingTasks} renderItem={renderTaskItem} keyExtractor={(item) => item.id} />

      {/* Floating Chat Button */}
      <TouchableOpacity style={styles.chatButton}>
        <Ionicons name="chatbubble-ellipses" size={28} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default ViewTasksScreen;

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
  chatButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
