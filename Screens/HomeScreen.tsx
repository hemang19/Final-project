import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";


type TabParamList = {
  Home: { username: string };
  Profile: { username: string };
};

type HomeScreenRouteProp = RouteProp<TabParamList, "Home">;
type NavigationProp = BottomTabNavigationProp<any>;

type Task = {
  id: string;
  title: string;
  date: string;
  daysRemaining: number;
  urgent: boolean;
  selectedColor: string | null;
};

const HomeScreen = ({ route }: { route: HomeScreenRouteProp }) => {
  const { username } = route.params;
  const navigation = useNavigation<NavigationProp>();

  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);

  const handleViewTasks = () => {
    navigation.navigate("ViewTasks");
  };

  const handleAddTask = () => {
    navigation.navigate("AddTask");
  };

  const handleAssignTask = () => {
    navigation.navigate("AssignTask");
  };

  const handleProgress = () => {
    navigation.navigate("Progress"); 
  };

  const handleRecent = () => {
    navigation.navigate("RecentTasks");
  };  

  useFocusEffect(
    useCallback(() => {
      const loadTasks = async () => {
        const storedTasks = await AsyncStorage.getItem("tasks");
        if (storedTasks) {
          const parsedTasks: Task[] = JSON.parse(storedTasks);
  
          const sortedTasks = parsedTasks.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });
  
          setUpcomingTasks(sortedTasks.slice(0, 4));
        }
      };
  
      loadTasks();
    }, [])
  );  

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
        <TouchableOpacity style={styles.progressButton} onPress={handleProgress}>
          <Text style={styles.buttonText}>Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.recentButton} onPress={handleRecent}>
          <Text style={styles.buttonText}>Recent</Text>
        </TouchableOpacity>
      </View>

      {/* Upcoming Tasks */}
      <View style={styles.taskCard}>
        <Text style={styles.taskTitle}>Upcoming Tasks</Text>
          {upcomingTasks.map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <Text style={styles.taskName}>{task.title}</Text>
              <Text style={task.urgent ? styles.taskDeadlineUrgent : styles.taskDeadline}>
                {task.date} {task.urgent && `• ${task.daysRemaining} days remaining`}
              </Text>
            </View>
          ))}

        {upcomingTasks.length >= 4 && (
          <TouchableOpacity onPress={() => navigation.navigate("ViewTasks")}>
            <Text style={styles.viewMore}>View More</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Start Your Day Section */}
      <Text style={styles.startYourDayText}>Start your day</Text>
      <TouchableOpacity style={styles.actionButton} onPress={handleViewTasks}>
        <Text style={styles.actionButtonText}>View Tasks</Text>
        <Ionicons name="arrow-forward" size={20} color="black" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={handleAddTask}>
        <Text style={styles.actionButtonText}>Add Tasks</Text>
        <Ionicons name="add" size={20} color="black" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={handleAssignTask}>
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
  viewMore: {
    marginTop: 10,
    color: "#007AFF",
    fontWeight: "bold",
    textAlign: "right",
  },
  taskDeadlineUrgent: {
    fontSize: 14,
    color: "#D32F2F",
    fontWeight: "bold",
  },
});
