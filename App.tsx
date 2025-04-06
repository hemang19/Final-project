import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignInScreen from "./Screens/SignInScreen";
import TabNavigator from "./Screens/TabNavigator";
import ViewTasksScreen from "./Screens/ViewTasks";
import AddTaskScreen from "./Screens/AddTask";
import AssignTaskScreen from "./Screens/AssignTask";
import ProgressScreen from "./Screens/Progress";
import TaskCompletionScreen from "./Screens/TaskCompletion";
import RecentTasksScreen from "./Screens/RecentTasksScreen";

type RootStackParamList = {
  SignIn: undefined;
  Home: { username: string };
  ViewTasks: undefined;
  AddTask: undefined;
  AssignTask: undefined;
  Progress: undefined;
  TaskComplete: { taskId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} />

        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {({ route }) => <TabNavigator username={route.params?.username} />}
        </Stack.Screen>

        <Stack.Screen name="ViewTasks" component={ViewTasksScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AssignTask" component={AssignTaskScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Progress" component={ProgressScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TaskComplete" component={TaskCompletionScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="RecentTasks" component={RecentTasksScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


