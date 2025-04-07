import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";
import ProfileScreen from "./ProfileScreen";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons

type TabParamList = {
  Home: { username: string }; 
  Profile: { username: string };
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = ({ username }: { username: string }) => {
  return (
    <Tab.Navigator>
      {/* Home Screen Tab with Icon */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}  
        initialParams={{ username }}  
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} /> // Home Icon
          ),
        }}
      />

      {/* Profile Screen Tab with Icon */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen} 
        initialParams={{ username }}  
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} /> // Profile Icon
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
