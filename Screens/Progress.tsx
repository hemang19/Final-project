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
  const [selectedMonth, setSelectedMonth] = useState<number | null>(currentMonth);
  const [tasksDue, setTasksDue] = useState(0);
  const [tasksComplete, setTasksComplete] = useState(0);
  const [chartData, setChartData] = useState<{ labels: string[]; data: number[] }>({
    labels: [],
    data: [],
  });

  const [chartKey, setChartKey] = useState(0);
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
      if (!selectedMonth) return;

      try {
        const stored = await AsyncStorage.getItem("tasks");
        const tasks = stored ? JSON.parse(stored) : [];
        const year = new Date().getFullYear();

        const dueTasks = tasks.filter((t: any) => {
          const date = new Date(t.date);
          return date.getMonth() + 1 === selectedMonth && date.getFullYear() === year;
        });

        const completedTasks = tasks.filter((t: any) => {
          if (!t.completed || !t.completedDate) return false;
          const compDate = new Date(t.completedDate);
          return compDate.getMonth() + 1 === selectedMonth && compDate.getFullYear() === year;
        });

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
        setChartKey((prev) => prev + 1);
      } catch (error) {
        console.error("Error loading task data:", error);
      }
    };

    loadData();
  }, [selectedMonth]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <Ionicons name="arrow-back" size={24} color="#002D62" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Progress</Text>
          <View style={{ width: 32 }} />
        </View>

        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/147/147144.png" }}
          style={styles.avatar}
        />

        <View style={styles.tabHeader}>
          <Text style={styles.tabActive}>Stats</Text>
        </View>

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

        {selectedMonth && (
          <>
            <Text style={styles.stats}>
              Total tasks due in {months[selectedMonth - 1]?.label}: {tasksDue}
            </Text>
            <Text style={styles.stats}>Total tasks complete: {tasksComplete}</Text>
          </>
        )}

        {chartData.data.length > 0 ? (
          <View style={styles.chartWrapper}>
            <Text style={styles.chartTitle}>
              {months[selectedMonth - 1]?.label}
            </Text>
            <BarChart
              key={chartKey}
              data={{
                labels: chartData.labels,
                datasets: [{ data: chartData.data }],
              }}
              width={Dimensions.get("window").width - 40}
              height={280}
              fromZero
              showValuesOnTopOfBars
              yAxisLabel=""
              withInnerLines
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: () => `#002D62`,
                labelColor: () => "#000",
                propsForBackgroundLines: {
                  strokeDasharray: "4",
                  stroke: "#ccc",
                },
                barPercentage: 0.9,
              }}
              style={{
                borderRadius: 12,
                marginTop: 16,
              }}
              verticalLabelRotation={0}
              segments={4}
            />
          </View>
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20, color: "#888" }}>
            No data to show for this month.
          </Text>
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
    borderRadius: 50,
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
    color: "#002D62",
  },
  tabHeader: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  tabActive: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#002D62",
    borderBottomWidth: 2,
    borderColor: "#002D62",
    paddingBottom: 4,
  },
  picker: {
    fontSize: 16,
    padding: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: "#f2f2f2",
  },
  stats: {
    fontSize: 18,
    marginVertical: 5,
    textAlign: "center",
    color: "#002D62",
  },
  chartWrapper: {
    marginTop: 30,
    paddingBottom: 20,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
    color: "#002D62",
  },
});
