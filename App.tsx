import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "./Screens/SignInScreen";
import TabNavigator from "./Screens/TabNavigator";
import ViewTasksScreen from "./Screens/ViewTasks";  // Import ViewTasksScreen correctly
import AddTaskScreen from "./Screens/AddTask";  // Import the new AddTaskScreen

type RootStackParamList = {
  SignIn: undefined;
  Home: { username: string };
  ViewTasks: undefined;  // Add ViewTasksScreen to the stack
  AddTask: undefined;  // Add AddTaskScreen to the stack
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
        <Stack.Screen name="ViewTasks" component={ViewTasksScreen} />
        
        {/* AddTaskScreen for adding a new task */}
        <Stack.Screen name="AddTask" component={AddTaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
