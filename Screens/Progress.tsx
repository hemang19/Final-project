import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { BarChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const ProgressScreen = () => {
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [tasksDue, setTasksDue] = useState(0);
  const [tasksComplete, setTasksComplete] = useState(0);
  const [chartData, setChartData] = useState<{ labels: string[]; data: number[] }>({
    labels: [],
    data: [],
  });

  const navigation = useNavigation();

  const months = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

  useEffect(() => {
    const loadData = async () => {
      const stored = await AsyncStorage.getItem("tasks");
      const tasks = stored ? JSON.parse(stored) : [];

      const year = new Date().getFullYear();

      // Tasks due in the selected month
      const dueTasks = tasks.filter((t: any) => {
        const date = new Date(t.date);
        return date.getMonth() + 1 === selectedMonth && date.getFullYear() === year;
      });

      // Tasks completed in the selected month based on completedDate
      const completedTasks = tasks.filter((t: any) => {
        if (!t.completed || !t.completedDate) return false;
        const compDate = new Date(t.completedDate);
        return compDate.getMonth() + 1 === selectedMonth && compDate.getFullYear() === year;
      });

      // Chart: count how many were completed on each day
      const dayMap: { [day: number]: number } = {};
      completedTasks.forEach((t: any) => {
        const day = new Date(t.completedDate).getDate();
        dayMap[day] = (dayMap[day] || 0) + 1;
      });

      const labels = Object.keys(dayMap).map((day) => day.toString());
      const data = Object.values(dayMap);

      setTasksDue(dueTasks.length);
      setTasksComplete(completedTasks.length);
      setChartData({ labels, data });
    };

    loadData();
  }, [selectedMonth]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Progress</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Profile image */}
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/147/147144.png" }}
          style={styles.avatar}
        />

        {/* Month selector */}
        <RNPickerSelect
          onValueChange={(value) => setSelectedMonth(value)}
          value={selectedMonth}
          items={months}
          placeholder={{ label: "Select a month", value: null }}
          style={{
            inputIOS: styles.picker,
            inputAndroid: styles.picker,
          }}
        />

        {/* Stats */}
        <Text style={styles.stats}>
          Total tasks due in {months[selectedMonth - 1].label}: {tasksDue}
        </Text>
        <Text style={styles.stats}>Total tasks complete: {tasksComplete}</Text>

        {/* Chart */}
        {chartData.data.length > 0 && (
          <View style={styles.chartWrapper}>
            <BarChart
              data={{
                labels: chartData.labels,
                datasets: [{ data: chartData.data }],
              }}
              width={Dimensions.get("window").width - 40}
              height={220}
              fromZero
              showValuesOnTopOfBars
              yAxisLabel=""
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: () => "#4682B4",
                labelColor: () => "#000",
              }}
              style={{ borderRadius: 16 }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProgressScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  avatar: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  picker: {
    fontSize: 16,
    padding: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: "#f2f2f2",
  },
  stats: {
    fontSize: 18,
    marginVertical: 5,
    textAlign: "center",
  },
  chartWrapper: {
    marginTop: 20,
    paddingBottom: 20,
  },
});
