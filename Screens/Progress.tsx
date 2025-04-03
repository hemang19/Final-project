import React, { useState, useEffect } from "react";
import {View, Text, StyleSheet, Image, Dimensions, ScrollView,} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { BarChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";


const getDaysInMonth = (month: number, year: number) =>
  new Date(year, month, 0).getDate();

const ProgressScreen = () => {
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [tasksDue, setTasksDue] = useState(0);
  const [tasksComplete, setTasksComplete] = useState(0);
  const [chartData, setChartData] = useState<number[]>([]);

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
      const days = getDaysInMonth(selectedMonth, year);
      const chartArray = new Array(days).fill(0);

      const filtered = tasks.filter((t: any) => {
        const date = new Date(t.date);
        return date.getMonth() + 1 === selectedMonth;
      });

      const completed = filtered.filter((t: any) => t.completed === true);

      completed.forEach((t: any) => {
        const day = new Date(t.date).getDate();
        chartArray[day - 1]++;
      });

      setTasksDue(filtered.length);
      setTasksComplete(completed.length);
      setChartData(chartArray);
    };

    loadData();
  }, [selectedMonth]);

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: "https://cdn-icons-png.flaticon.com/512/147/147144.png" }}
        style={styles.avatar}
      />
      <Text style={styles.title}>My Progress</Text>

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

      <Text style={styles.stats}>
        Total tasks due in {months[selectedMonth - 1].label}: {tasksDue}
      </Text>
      <Text style={styles.stats}>Total tasks complete: {tasksComplete}</Text>

      {/* Only show chart if there's data > 0 */}
      {chartData.some((val) => val > 0) && (
        <View style={styles.chartWrapper}>
          <BarChart
            data={{
              labels: chartData.map((_, i) => {
                const day = i + 1;
                const lastDay = chartData.length;
                return [1, 7, 13, 21, lastDay].includes(day)
                  ? day.toString()
                  : "";
              }),
              datasets: [{ data: chartData }],
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
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
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


