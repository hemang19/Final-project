import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "./Screens/SignInScreen";
import TabNavigator from "./Screens/TabNavigator";
import ViewTasksScreen from "./Screens/ViewTasks";  // Import ViewTasksScreen correctly
import AddTaskScreen from "./Screens/AddTask";  // Import the new AddTaskScreen
import AssignTaskScreen from "./Screens/AssignTask";  // Import AssignTaskScreen

type RootStackParamList = {
  SignIn: undefined;
  Home: { username: string };
  ViewTasks: undefined;
  AddTask: undefined;
  AssignTask: undefined;  // Add AssignTaskScreen to the stack
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} />
        
        {/* Home screen, passing username to TabNavigator */}
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {({ route }) => <TabNavigator username={route.params?.username} />}
        </Stack.Screen>
        
        {/* ViewTasksScreen */}
        <Stack.Screen name="ViewTasks" component={ViewTasksScreen} options={{ headerShown: false }} />
        
        {/* AddTaskScreen for adding a new task */}
        <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ headerShown: false }} />
        
        {/* AssignTaskScreen for assigning tasks */}
        <Stack.Screen name="AssignTask" component={AssignTaskScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
