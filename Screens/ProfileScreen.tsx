import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Link, RouteProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

// Define the tab param list
type TabParamList = {
  Home: { username: string };
  Profile: { username: string };
};

type ProfileScreenRouteProp = RouteProp<TabParamList, "Profile">;
type NavigationProp = BottomTabNavigationProp<TabParamList, "Profile">;

const ProfileScreen = ({ route }: { route: ProfileScreenRouteProp }) => {
  const { username } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.header}>{username}</Text>

      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/147/147144.png" }}
          style={styles.avatar}
        />
        <View style={styles.profileText}>
          <Text style={styles.userSince}>User since: November 2024</Text>
          {/* Link has to be updated to link to a QR code? */}
          <Link href="#" style={styles.shareProfile}>Share profile</Link>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Account Settings */}
      <Text style={styles.sectionTitle}>Account setting</Text>
      <View style={styles.settingsList}>
        <Text style={styles.settingItem}>Change username</Text>
        <Text style={styles.settingItem}>Change email</Text>
        <Text style={styles.settingItem}>Change password</Text>
        <Text style={styles.settingItem}>Change profile image</Text>
        <Text style={styles.settingItem}>Notification settings</Text>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileText: {
    flex: 1,
  },
  userSince: {
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 16,
  },
  shareProfile: {
    color: "gray",
    textDecorationLine: "underline",
    fontSize: 16,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  settingsList: {
    gap: 10,
  },
  settingItem: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
  },
});
