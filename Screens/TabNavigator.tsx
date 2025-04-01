import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";
import ProfileScreen from "./ProfileScreen";

type TabParamList = {
  Home: { username: string }; 
  Profile: { username: string };
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = ({ username }: { username: string }) => {
  return (
    <Tab.Navigator>
      {/* Home Screen Tab */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}  
        initialParams={{ username }}  
      />

      {/* Profile Screen Tab */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen} 
        initialParams={{ username }}  
      />

    </Tab.Navigator>
  );
};

export default TabNavigator;
