import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // For icons

// Define the tab param list
type TabParamList = {
  Home: { username: string };
  Calgary: undefined;
  Edmonton: undefined;
};

type HomeScreenRouteProp = RouteProp<TabParamList, "Home">;
type NavigationProp = BottomTabNavigationProp<TabParamList, "Home">;

const HomeScreen = ({ route }: { route: HomeScreenRouteProp }) => {
  const { username } = route.params;
  const navigation = useNavigation<NavigationProp>();

  const handleViewTasks = () => {
    // Navigate to ViewTasks screen
    navigation.navigate("ViewTasks");
  };

  const handleAddTask = () => {
    // Navigate to AddTask screen
    navigation.navigate("AddTask");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Greeting Section */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Morning, {username}!</Text>
        <TouchableOpacity>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/147/147144.png" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Progress and Recent Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.progressButton}>
          <Text style={styles.buttonText}>Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.recentButton}>
          <Text style={styles.buttonText}>Recent</Text>
        </TouchableOpacity>
      </View>

      {/* Upcoming Tasks */}
      <View style={styles.taskCard}>
        <Text style={styles.taskTitle}>Upcoming Tasks</Text>
        <View style={styles.taskItem}>
          <Text style={styles.taskName}>Capstone phase 1 presentation</Text>
          <Text style={styles.taskDeadline}>March 7, 2025 - 2 days remaining</Text>
        </View>
      </View>

      {/* Start Your Day Section */}
      <Text style={styles.startYourDayText}>Start your day</Text>
      <TouchableOpacity style={styles.actionButton} onPress={handleViewTasks}>
        <Text style={styles.actionButtonText}>View Tasks</Text>
        <Ionicons name="arrow-forward" size={20} color="black" />
      </TouchableOpacity>

      {/* Add Task Button */}
      <TouchableOpacity style={styles.actionButton} onPress={handleAddTask}>
        <Text style={styles.actionButtonText}>Add Tasks</Text>
        <Ionicons name="add" size={20} color="black" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>Assign Task</Text>
        <Ionicons name="person-add" size={20} color="black" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  progressButton: {
    flex: 1,
    padding: 15,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
  recentButton: {
    flex: 1,
    padding: 15,
    backgroundColor: "#34C759",
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  taskCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  taskItem: {
    backgroundColor: "#E3F2FD",
    padding: 10,
    borderRadius: 8,
  },
  taskName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  taskDeadline: {
    fontSize: 14,
    color: "#D32F2F",
  },
  startYourDayText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
